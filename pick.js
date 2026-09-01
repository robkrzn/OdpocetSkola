// Vyber dennej patky a seria dni. Bezi v prehliadaci aj v Node, rovnakym trikom
// ako stops.js. Algoritmy su z .doc/01-ARCHITEKTURA.md - drz sa pseudokodu tam,
// nevymyslaj vlastny. Jediny zdroj tem a terminov su questions/*.json a stops.js,
// tento subor si ich nikdy nekopiruje.

// -- normalizacia odpovedi --------------------------------------------------
// Runtime porovnava retazce, nie vyznamy. Co je prijatelne je uz v `accept`
// pri tazeni - normalize() nikdy nehada semantiku (diakritika sa nemaze,
// jednotky sa nedoplnaju).

function normalize(s) {
  return String(s)
    .replace(/ /g, ' ')            // NBSP -> medzera
    .replace(/(\d)[  ]+(?=\d)/g, '$1') // medzery vnutri cisel: "1 250" -> "1250"
    .trim()
    .replace(/\s+/g, ' ')               // zvysne viacnasobne medzery na jednu
    .replace(/(\d),(?=\d)/g, '$1.')     // desatinna ciarka -> bodka
    .replace(/[‐-―−]/g, '-') // rozne pomlcky/minus -> ASCII "-"
    .toLowerCase();
}

// -- FNV-1a hash + mulberry32 + Fisher-Yates shuffle -------------------------
// 12 riadkov, ziadna zavislost. Musi byt deterministicke aj v Node, aby sa
// dal vyber otestovat bez prehliadaca.

function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, seed) {
  const out = arr.slice();
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// -- vyber dennej davky --------------------------------------------------
// questions/*.json nesie predpocitane `units`; EPOCH je den 0 hry.

const EPOCH = Date.UTC(2026, 8, 1);
const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Bratislava' }).format(new Date());
const dayIndex = iso => Math.round((Date.parse(iso + 'T12:00:00Z') - EPOCH) / 864e5);

// ponytail: doc pseudokod zatvara bucket len cez jedno pravidlo "n >= want" a
// nerata s jednotkami az do velkosti 7 (citacie ukazky v SJL maju 7 otazok).
// V jednom priebehu vie taka jednotka pristat v uz rozbehnutom buckete a
// vyrobit den o 8-10 ulohach, alebo naopak nechat za sebou 1-2-ulohovy zvysok.
// Oprava: jednotka s >= min ulohami uz sama o sebe padne do 3-7, tak ide do
// vlastneho dna rovno; len jednotky pod min sa zlievaju medzi sebou pravidlom
// z pseudokodu. Poradie dni v priechode sa este raz premiesa, nech sa citi
// rovnako nahodne ako predtym.
function daily(bank, di, want = 4) {
  const min = 3, max = 7;
  const nominal = Math.max(1, Math.floor(bank.itemCount / want)); // kolko dni vydrzi priechod
  const pass = Math.floor(di / nominal);
  const order = shuffle(bank.units.map((_, i) => i), hash(bank.subject + ':' + pass));

  const bigDays = [];
  const smallOrder = [];
  for (const u of order) {
    if (bank.units[u].ids.length >= min) bigDays.push([u]);
    else smallOrder.push(u);
  }

  const smallDays = [];
  let bucket = [], n = 0;
  for (const u of smallOrder) {
    bucket.push(u); n += bank.units[u].ids.length;
    if (n >= want) { smallDays.push(bucket); bucket = []; n = 0; }
  }
  if (bucket.length) {
    const last = smallDays[smallDays.length - 1];
    const lastSize = last ? last.reduce((s, u) => s + bank.units[u].ids.length, 0) : 0;
    if (n < min && last && lastSize + n <= max) last.push(...bucket);
    else smallDays.push(bucket);
  }

  const days = shuffle([...bigDays, ...smallDays], hash(bank.subject + ':' + pass + ':days'));
  return days[di % days.length];
}

// -- seria dni ----------------------------------------------------------
// Seria sa neuklada, pocita sa z mnoziny dokoncenych dni - pocitadlo by driftovalo.

const RANKS = [[60, 'MEDZINÁRODNÝ'], [30, 'INTERCITY'], [14, 'EXPRES'], [7, 'RÝCHLIK'], [3, 'ZRÝCHLENÝ'], [0, 'OSOBNÝ']];

function nextDay(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function isWeekend(iso) {
  const day = new Date(iso + 'T12:00:00Z').getUTCDay();
  return day === 0 || day === 6;
}

function streakState(doneDates, todayISO) {
  const done = new Set(doneDates);
  const sorted = [...done].sort();
  let days = 0, best = 0, reserves = 0;
  if (!sorted.length) return { days, best, reserves, rank: 'OSOBNÝ' };
  for (let d = sorted[0]; d <= todayISO; d = nextDay(d)) {
    if (done.has(d)) {
      days++;
      if (days % 7 === 0) reserves = Math.min(2, reserves + 1);
      best = Math.max(best, days);
    } else if (isWeekend(d) || d === todayISO) {
      // vikend nic nestoji; dnesny den este nie je zmeskany
    } else if (reserves > 0) {
      reserves--;                       // rezerva pokryje zmeskany pracovny den
    } else {
      days = 0;
    }
  }
  return { days, best, reserves, rank: RANKS.find(([n]) => days >= n)[1] };
}

// send.js a og.mjs bezia v Node, kde global var nestaci. V prehliadaci sa preskoci.
if (typeof module !== 'undefined') {
  module.exports = { daily, shuffle, hash, streakState, normalize, today, dayIndex, EPOCH };
}
