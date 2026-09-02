// Tie iste zastavky, ake ukazuje tabula na stranke - jeden subor, ziadna druha kopia.
const STOPS = require("./stops.js");

const TZ = "Europe/Bratislava";
const SEND_AT_HOUR = 15;
// Meskajuci beh smie dobehnut do vecera. Neskor uz nie - v noci sa spi a rano je Paulinka v skole.
const SEND_UNTIL_HOUR = 22;

// 1 -> deň, 2-4 -> dni, 0 a 5+ -> dní
const sk = (n, [one, few, many]) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

function duration(ms) {
  const min = Math.floor(ms / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  return [
    `${d} ${sk(d, ["deň", "dni", "dní"])}`,
    `${h % 24} ${sk(h % 24, ["hodina", "hodiny", "hodín"])}`,
    `${min % 60} ${sk(min % 60, ["minúta", "minúty", "minút"])}`,
  ].join(" ");
}

/** Prva zastavka v buducnosti, alebo null ked uz zadna nie je. */
const nextStop = (now) => STOPS.find((s) => Date.parse(s.at) > now.getTime()) || null;

/** Dve premenne do WhatsApp template, alebo null ked nie je co posielat. */
function message(now = new Date()) {
  const stop = nextStop(now);
  return stop && { what: stop.what, left: duration(Date.parse(stop.at) - now.getTime()) };
}

/** Cron v GitHub Actions je len v UTC, takze bezi 2x - letny a zimny cas. */
function localHour(now = new Date()) {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hour12: false });
  return Number(f.format(now));
}

/** Posun zony v celych hodinach: CEST 2, CET 1. */
const tzOffset = (now) => (localHour(now) - now.getUTCHours() + 24) % 24;

/** Ktory z dvoch cronov je ten dnesny spravny. GitHub cron mesta aj hodiny, takze sa
 *  neda pytat "je prave 17:00" - to zahodilo skoro kazdy beh. Cron sa meskanim nemeni. */
const isTodaysCron = (schedule, now = new Date()) =>
  Number((schedule || "").split(" ")[1]) === (SEND_AT_HOUR - tzOffset(now) + 24) % 24;

/** Okno, v ktorom sa este oplati poslat: od 15:00 do 21:59. Sirsie okno = vacsia tolerancia meskania. */
const inWindow = (now = new Date()) => {
  const h = localHour(now);
  return h >= SEND_AT_HOUR && h < SEND_UNTIL_HOUR;
};

/** V Actions rozhoduje cron, lokalne (bez SCHEDULE) hodina - aby sa dal skusit beh nasucho. */
const shouldSend = (now = new Date()) => inWindow(now) &&
  (process.env.SCHEDULE ? isTodaysCron(process.env.SCHEDULE, now) : localHour(now) === SEND_AT_HOUR);

// Odkaz na tabulu je staticke URL tlacidlo priamo v template, netreba ho posielat.
/** Meta pri pokazenej hlavicke vrati HTML stranku, nie JSON - to sa neda citat v logu. */
function apiError(status, body) {
  try {
    const e = JSON.parse(body).error;
    return `WhatsApp ${status}: ${e.message}${e.code ? ` (code ${e.code})` : ""}`;
  } catch {
    return `WhatsApp ${status}: odpoved nie je JSON, Meta vratila HTML chybovu stranku. ` +
      `Skoro vzdy to znamena pokazeny WA_TOKEN - newline z paste, vlozeny dvakrat, alebo useknuty.`;
  }
}

/** WA_TO je ciarkou oddeleny zoznam - Cloud API vezme vzdy len jedno cislo naraz. */
const recipients = (raw) => (raw || "").split(",").map((s) => s.trim()).filter(Boolean);

async function send({ what, left }) {
  const { WA_PHONE_ID, WA_TO } = process.env;
  // Paste do terminalu rad prilepi newline alebo mezeru; s tym Meta vrati HTML, nie chybu.
  const WA_TOKEN = (process.env.WA_TOKEN || "").trim();
  if (!WA_TOKEN || !WA_PHONE_ID || !WA_TO) throw new Error("Chýbajú secrets: WA_TOKEN / WA_PHONE_ID / WA_TO");
  if (!/^[A-Za-z0-9_-]+$/.test(WA_TOKEN)) throw new Error("WA_TOKEN obsahuje neplatné znaky - vložil sa pokazený alebo nekompletný token");
  // Jedno pokazene cislo nesmie umlcat ostatnych - poslem vsetkym, chyby zhrniem az na konci.
  const errors = [];
  for (const to of recipients(WA_TO)) {
    const res = await fetch(`https://graph.facebook.com/v25.0/${WA_PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "odpocet_pripomienka",
          language: { code: "sk" },
          components: [{
            type: "body",
            parameters: [what, left].map((text) => ({ type: "text", text })),
          }],
        },
      }),
    });
    console.log(res.ok ? `poslané ${to}` : `zlyhalo ${to}`);
    if (!res.ok) errors.push(`${to}: ${apiError(res.status, await res.text())}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

/* Zrkadlo textu z Meta template `odpocet_pripomienka`. Kod tento retazec NEPOSIELA -
   odoslane znenie drzi template a kod mu dava len dve premenne. Vypisuje sa do logu
   a do `--test`, aby bolo vidiet, co pojde von.
   Ked sa meni template, meni sa aj tento riadok. Inak log tvrdi nieco ine, nez
   prijemca dostane. Zavazne znenie je v .doc/01-ARCHITEKTURA.md, sekcia
   "WhatsApp pripomienka v v2". */
const preview = (m) =>
  `Do ${m.what} zostáva ${m.left}. Poď si niečo zopakovať - dnešná päťka z matiky a sloviny je pripravená. [Otvoriť test]`;

if (process.argv[2] === "--test") {
  const assert = require("node:assert");
  const at = (s) => new Date(s);

  // sklonovanie a hranice odpoctu (ciel: 2027-03-17T08:00+01:00)
  const dur = (s) => duration(Date.parse("2027-03-17T08:00:00+01:00") - Date.parse(s));
  assert.strictEqual(dur("2027-03-16T07:00:00+01:00"), "1 deň 1 hodina 0 minút");
  assert.strictEqual(dur("2027-03-15T05:30:00+01:00"), "2 dni 2 hodiny 30 minút");
  assert.strictEqual(dur("2027-03-13T03:15:00+01:00"), "4 dni 4 hodiny 45 minút");
  assert.strictEqual(dur("2027-03-12T02:05:00+01:00"), "5 dní 5 hodín 55 minút");

  // prepinanie zastavok - jadro kombinacie s tabulou
  assert.strictEqual(nextStop(at("2026-08-20T12:00:00+02:00")).what, "začiatku školského roka");
  assert.strictEqual(nextStop(at("2026-09-01T07:49:00+02:00")).what, "začiatku školského roka");
  assert.strictEqual(nextStop(at("2026-09-01T07:51:00+02:00")).what, "Testovania 9");
  assert.strictEqual(nextStop(at("2027-03-17T07:59:00+01:00")).what, "Testovania 9");
  assert.strictEqual(nextStop(at("2027-03-17T08:01:00+01:00")), null);
  assert.strictEqual(message(at("2027-03-18T00:00:00+01:00")), null);

  // zoznam prijemcov - ciarky, medzery a prazdne polozky
  assert.deepStrictEqual(recipients("421900000001"), ["421900000001"]);
  assert.deepStrictEqual(recipients(" 421900000001 , 421900000002 ,"), ["421900000001", "421900000002"]);
  assert.deepStrictEqual(recipients(""), []);

  // chyby od Mety musia byt citatelne v logu Actions
  assert.match(apiError(400, "<!DOCTYPE html><html>"), /HTML chybovu stranku/);
  assert.strictEqual(apiError(401, '{"error":{"message":"Authentication Error","code":190}}'),
    "WhatsApp 401: Authentication Error (code 190)");

  // letny aj zimny cas musia trafit 15:00 miestneho
  assert.strictEqual(localHour(at("2026-08-08T13:00:00Z")), 15); // CEST
  assert.strictEqual(localHour(at("2026-12-08T14:00:00Z")), 15); // CET

  // spravny cron sa vyberie podla zony, nie podla hodiny behu
  assert.strictEqual(isTodaysCron("0 13 * * *", at("2026-08-08T13:00:00Z")), true);  // CEST
  assert.strictEqual(isTodaysCron("0 14 * * *", at("2026-08-08T13:00:00Z")), false);
  assert.strictEqual(isTodaysCron("0 14 * * *", at("2026-12-08T14:00:00Z")), true);  // CET
  assert.strictEqual(isTodaysCron("0 13 * * *", at("2026-12-08T14:00:00Z")), false);
  // jadro opravy: meskajuci beh musi poslat, aj ked uz nie je 15:00
  assert.strictEqual(isTodaysCron("0 13 * * *", at("2026-08-30T18:20:31Z")), true);  // 5 h meskania
  assert.strictEqual(isTodaysCron("0 13 * * *", at("2026-08-28T00:11:01Z")), true);  // cez polnoc

  // ale len do vecera - v noci ani cez vyucovanie sa neposiela
  assert.strictEqual(inWindow(at("2026-08-30T13:00:00Z")), true);   // 15:00, presne cas
  assert.strictEqual(inWindow(at("2026-08-30T18:20:31Z")), true);   // 20:20, meskanie ok
  assert.strictEqual(inWindow(at("2026-08-29T19:14:00Z")), true);   // 21:14, posledna sanca
  assert.strictEqual(inWindow(at("2026-08-29T20:00:00Z")), false);  // 22:00, uz noc
  assert.strictEqual(inWindow(at("2026-08-28T00:11:01Z")), false);  // 02:11, noc
  assert.strictEqual(inWindow(at("2026-08-28T07:00:00Z")), false);  // 09:00, v skole
  assert.strictEqual(inWindow(at("2026-08-28T12:00:00Z")), false);  // 14:00, este v skole

  console.log("ok, teraz:", preview(message()));
} else {
  const m = message();
  const h = localHour();
  if (!m) {
    console.log("žiadna ďalšia zastávka, niet čo posielať");
  } else if (!shouldSend() && process.argv[2] !== "--force") {
    console.log(!inWindow()
      ? `preskočené, v ${TZ} je ${h}:00 - mimo okna ${SEND_AT_HOUR}:00-${SEND_UNTIL_HOUR - 1}:59, beh meškal priveľmi`
      : process.env.SCHEDULE
        ? `preskočené, cron "${process.env.SCHEDULE}" nie je ten dnešný, posiela ten druhý`
        : `preskočené, v ${TZ} je ${h}:00, posiela sa o ${SEND_AT_HOUR}:00`);
  } else {
    send(m).then(
      () => console.log("hotovo:", preview(m)),
      (e) => { console.error(e.message); process.exit(1); }
    );
  }
}
