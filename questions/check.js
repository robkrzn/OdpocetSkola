// Validator banky otazok. Cisty Node, bez zavislosti. Zoznam assertov je
// z .doc/02-BANKA-OTAZOK.md, sekcia "Validator".
//
//   node questions/check.js              overi questions/mat.json + sjl.json
//   node questions/check.js <subor>...   overi len dane subory
//   node questions/check.js --daily      self-check vyberu dennej patky (400 dni)
//   node questions/check.js --streak     self-check serie dni

const fs = require('fs');
const path = require('path');
const pick = require('../pick.js');

const DIR = __dirname;
const DEFAULT_BANKS = [path.join(DIR, 'mat.json'), path.join(DIR, 'sjl.json')];

// Uzavrety zoznam tem z .doc/02-BANKA-OTAZOK.md - jediny zdroj pravdy o temach su
// tieto dva zoznamy, banka sama zo seba novu temu vymysliet nesmie.
const MAT_TOPICS = [
  'zlomky-desatinne', 'percenta-pomer', 'mocniny-odmocniny', 'vyrazy-rovnice',
  'slovne-ulohy', 'umernost-trojclenka', 'rovinne-obrazce', 'telesa',
  'uhly-konstrukcie', 'pytagorova-veta', 'funkcie-grafy',
  'statistika-pravdepodobnost', 'kombinatorika-logika', 'jednotky-premeny',
];
const SJL_TOPICS = [
  'pravopis', 'hlaskoslovie', 'tvaroslovie', 'slovna-zasoba', 'skladba',
  'sloh-postupy', 'literarna-teoria', 'poetika', 'porozumenie-textu',
  'autori-diela', 'komunikacia',
];
const TOPICS_BY_SUBJECT = { mat: MAT_TOPICS, sjl: SJL_TOPICS };

function validateBank(bank, label, dir) {
  const errors = [];
  const warnings = [];
  const err = m => errors.push(`[${label}] ${m}`);
  const warn = m => warnings.push(`[${label}] ${m}`);

  const REQUIRED = ['subject', 'version', 'generated', 'itemCount', 'sources', 'stimuli', 'units', 'items'];
  for (const f of REQUIRED) if (!(f in bank)) err(`chyba povinne pole "${f}"`);
  if (errors.length) return { errors, warnings }; // bez zakladnej struktury nema zmysel pokracovat

  const subject = bank.subject;
  const topics = TOPICS_BY_SUBJECT[subject];
  if (!topics) err(`neznamy subject "${subject}"`);

  if (!Array.isArray(bank.sources) || bank.sources.length === 0) err('chyba "sources"');

  const itemIdRe = new RegExp(`^${subject}-\\d{4}-[a-z]-\\d{2}$`);
  const stimIdRe = new RegExp(`^${subject}-\\d{4}-[a-z]-s\\d+$`);

  // stimuli: format id a neprazdne body
  for (const [sid, s] of Object.entries(bank.stimuli || {})) {
    if (!stimIdRe.test(sid)) err(`stimulus id "${sid}" nesedi so vzorom <subject>-<rok>-<forma>-sN`);
    if (!s || !s.body || !String(s.body).trim()) err(`stimulus "${sid}" ma prazdne body`);
  }

  // units: kazde id z items v presne jednej jednotke, ziadna nad 5 uloh
  // (merge.mjs reze vacsie, aby den drzal slub "5 otazok na predmet")
  const idCount = new Map();
  bank.units.forEach((u, ui) => {
    if (u.stimulus !== null && !(u.stimulus in (bank.stimuli || {}))) {
      err(`units[${ui}].stimulus "${u.stimulus}" neexistuje v stimuli`);
    }
    if (!Array.isArray(u.ids) || u.ids.length === 0) err(`units[${ui}] nema ziadne ids`);
    if (u.ids && u.ids.length > 5) err(`units[${ui}] ma ${u.ids.length} uloh, viac ako 5`);
    for (const id of u.ids || []) idCount.set(id, (idCount.get(id) || 0) + 1);
  });
  for (const id of Object.keys(bank.items || {})) {
    const c = idCount.get(id) || 0;
    if (c === 0) err(`id "${id}" nie je v ziadnej jednotke`);
    else if (c > 1) err(`id "${id}" je duplicitne - v ${c} jednotkach`);
  }
  for (const id of idCount.keys()) {
    if (!(id in (bank.items || {}))) err(`jednotka odkazuje na neexistujuce id "${id}"`);
  }

  // itemCount
  const itemIds = Object.keys(bank.items || {});
  if (bank.itemCount !== itemIds.length) {
    err(`itemCount ${bank.itemCount} nesedi s poctom poloziek ${itemIds.length}`);
  }

  // items
  for (const [id, it] of Object.entries(bank.items || {})) {
    if (!itemIdRe.test(id)) err(`item id "${id}" nesedi so vzorom <subject>-<rok>-<forma>-NN`);
    if (topics && !topics.includes(it.topic)) err(`item "${id}" ma temu mimo uzavreteho zoznamu: "${it.topic}"`);
    if (!it.source) err(`item "${id}" nema source`);
    if (!it.text || it.text.length < 15) warn(`item "${id}" ma zadanie kratsie ako 15 znakov`);
    if (/obrázok|obrázku|diagram/i.test(it.text || '') && !it.asset) {
      warn(`item "${id}" spomina obrazok/diagram v zadani, ale nema asset`);
    }
    if (it.asset) {
      const assetPath = path.join(DIR, it.asset);
      if (!fs.existsSync(assetPath)) warn(`item "${id}" ma asset "${it.asset}", subor neexistuje`);
    }

    if (it.type === 'mc') {
      if (!Array.isArray(it.options) || it.options.length < 3) {
        err(`item "${id}" typu mc ma menej ako 3 moznosti`);
      } else {
        const idx = typeof it.answer === 'string' ? it.answer.charCodeAt(0) - 65 : -1;
        if (idx < 0 || idx >= it.options.length) err(`item "${id}" ma answer "${it.answer}" mimo rozsahu options`);
        const seen = new Set();
        for (const o of it.options) {
          const n = pick.normalize(o);
          if (seen.has(n)) warn(`item "${id}" ma moznosti s duplicitnym textom`);
          seen.add(n);
        }
      }
    } else if (it.type === 'num' || it.type === 'word') {
      if (!it.answer || !String(it.answer).trim()) {
        err(`item "${id}" typu ${it.type} ma prazdny answer`);
      } else {
        const n = pick.normalize(it.answer);
        if (pick.normalize(n) !== n) err(`item "${id}" answer po normalizacii nesedi sam so sebou (chyba v accept/normalize)`);
        if (it.type === 'num' && !/^-?\d+(\.\d+)?$/.test(n)) {
          err(`item "${id}" typu num ma answer, ktory po normalizacii nie je cislo: "${it.answer}"`);
        }
      }
      // "Vypis z ukazky..." - answer aj kazdy tvar z accept musi byt v ukazke doslova.
      if (/^vypíš/i.test(it.text || '')) {
        const unit = bank.units.find(u => (u.ids || []).includes(id));
        const reference = unit && unit.stimulus && bank.stimuli[unit.stimulus]
          ? bank.stimuli[unit.stimulus].body
          : it.text;
        const forms = [it.answer, ...(it.accept || [])].filter(Boolean);
        const found = forms.some(f => (reference || '').includes(f));
        if (!found) err(`item "${id}" je typu "Vypis z ukazky", ale answer/accept nie je podretazcom ukazky`);
      }
    }
  }

  if (itemIds.length < 40) warn(`subject "${subject}" ma len ${itemIds.length} uloh, menej ako 40`);

  return { errors, warnings };
}

function loadBank(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return { errors: [`nedá sa čítať súbor ${file}: ${e.message}`] };
  }
  try {
    return { bank: JSON.parse(raw) };
  } catch (e) {
    return { errors: [`neplatný JSON v ${file}: ${e.message}`] };
  }
}

function runValidate(files) {
  let ok = true;
  for (const file of files) {
    const label = path.basename(file);
    const { bank, errors: loadErrors } = loadBank(file);
    if (loadErrors) {
      loadErrors.forEach(e => console.error('CHYBA', e));
      ok = false;
      continue;
    }
    const { errors, warnings } = validateBank(bank, label);
    warnings.forEach(w => console.warn('VAROVANIE', w));
    errors.forEach(e => console.error('CHYBA', e));
    if (errors.length) {
      console.error(`FAIL ${label}: ${errors.length} chýb`);
      ok = false;
    } else {
      console.log(`OK ${label}: ${Object.keys(bank.items).length} úloh`);
    }
  }
  process.exit(ok ? 0 : 1);
}

// -- --daily: self-check vyberu dennej patky ----------------------------
// Rekonstruuje kazdy priechod priamo cez shuffle()+hash() z pick.js (rovnaky
// kod, aky pouziva daily()) a overi, ze ziadna jednotka v priechode nevypadne
// dvakrat ani sa nestrati, a ze kazdy den ma 3-7 uloh.

function runDailyCheck() {
  let ok = true;
  const want = 4;
  for (const file of DEFAULT_BANKS) {
    const label = path.basename(file);
    const { bank, errors: loadErrors } = loadBank(file);
    if (loadErrors) { loadErrors.forEach(e => console.error('CHYBA', e)); ok = false; continue; }

    const nominal = Math.max(1, Math.floor(bank.itemCount / want));
    const passes = Math.ceil(400 / nominal) + 1;

    for (let p = 0; p < passes; p++) {
      const order = pick.shuffle(bank.units.map((_, i) => i), pick.hash(bank.subject + ':' + p));
      // rovnaka rekonstrukcia ako v daily() z pick.js (jednotky >= min idu sami,
      // zvysok sa zlieva pravidlom z pseudokodu) - inak by tento self-check
      // overoval iny algoritmus, ako naozaj bezi.
      const min = 3, max = 7;
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
      const days = pick.shuffle([...bigDays, ...smallDays], pick.hash(bank.subject + ':' + p + ':days'));

      const seen = new Set();
      for (const [di, day] of days.entries()) {
        const count = day.reduce((s, u) => s + bank.units[u].ids.length, 0);
        if (count < 3 || count > 7) {
          console.error(`CHYBA [${label}] priechod ${p} deň ${di}: má ${count} úloh, mimo 3-7`);
          ok = false;
        }
        for (const u of day) {
          if (seen.has(u)) {
            console.error(`CHYBA [${label}] priechod ${p}: jednotka ${u} vypadla dvakrát`);
            ok = false;
          }
          seen.add(u);
        }
      }
      if (seen.size !== bank.units.length) {
        console.error(`CHYBA [${label}] priechod ${p}: pokrýva len ${seen.size}/${bank.units.length} jednotiek`);
        ok = false;
      }
    }

    // priama kontrola daily(): pocet uloh v prvych 400 dnoch musí byť vždy 3-7
    for (let di = 0; di < 400; di++) {
      const day = pick.daily(bank, di, want);
      const count = day.reduce((s, u) => s + bank.units[u].ids.length, 0);
      if (count < 3 || count > 7) {
        console.error(`CHYBA [${label}] daily(${di}) má ${count} úloh, mimo 3-7`);
        ok = false;
      }
    }

    console.log(`${label}: overených ${passes} priechodov (nominal=${nominal}), 400 dní cez daily()`);
  }
  console.log(ok ? 'OK --daily' : 'FAIL --daily');
  process.exit(ok ? 0 : 1);
}

// -- --streak: self-check serie dni --------------------------------------

function runStreakCheck() {
  const assert = require('node:assert');
  let failed = 0;
  const cases = [];

  function addDays(iso, n) {
    const d = new Date(iso + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function weekday(iso) {
    return new Date(iso + 'T12:00:00Z').getUTCDay(); // 0=Ne ... 6=So
  }
  function nextWeekday(iso, targetDow) {
    let d = iso;
    while (weekday(d) !== targetDow) d = addDays(d, 1);
    return d;
  }
  const MON = nextWeekday('2026-01-01', 1); // isty pondelok, nezavisle od dnesneho datumu

  function test(name, fn) {
    cases.push({ name, fn });
  }

  test('prázdny vstup vráti nuly', () => {
    assert.deepStrictEqual(pick.streakState([], '2026-09-01'), { days: 0, best: 0, reserves: 0, rank: 'OSOBNÝ' });
  });

  test('víkend nepretrhne sériu', () => {
    const fri = addDays(MON, 4);
    const nextMon = addDays(MON, 7);
    const s = pick.streakState([fri, nextMon], nextMon);
    assert.strictEqual(s.days, 2, `days=${s.days}`);
    assert.strictEqual(s.best, 2, `best=${s.best}`);
  });

  test('zmeškaný pracovný deň s rezervou nepretrhne sériu', () => {
    const week = Array.from({ length: 7 }, (_, i) => addDays(MON, i)); // 7 po sebe -> 1 rezerva
    const resumed = addDays(MON, 8); // MON+7 (pracovny den) zmeskany, MON+8 odohrany
    const s = pick.streakState([...week, resumed], resumed);
    assert.strictEqual(s.days, 8, `days=${s.days}`);
    assert.strictEqual(s.reserves, 0, `reserves=${s.reserves}`);
    assert.strictEqual(s.best, 8, `best=${s.best}`);
  });

  test('bez rezervy vynuluje sériu, rekord po vynulovaní zostáva', () => {
    const done = [MON, addDays(MON, 1), addDays(MON, 2), addDays(MON, 4)]; // MON+3 zmeskany, bez rezervy
    const today = addDays(MON, 4);
    const s = pick.streakState(done, today);
    assert.strictEqual(s.days, 1, `days=${s.days}`); // po vynulovani zacina znova
    assert.strictEqual(s.best, 3, `best=${s.best}`); // rekord z pred vynulovanim zostava
    assert.strictEqual(s.reserves, 0, `reserves=${s.reserves}`);
  });

  test('rezerva pribudne na 7./14./21. dni a nepresiahne 2', () => {
    const days21 = Array.from({ length: 21 }, (_, i) => addDays(MON, i));
    const s7 = pick.streakState(days21.slice(0, 7), days21[6]);
    const s14 = pick.streakState(days21.slice(0, 14), days21[13]);
    const s21 = pick.streakState(days21, days21[20]);
    assert.strictEqual(s7.reserves, 1, `po 7 dňoch reserves=${s7.reserves}`);
    assert.strictEqual(s14.reserves, 2, `po 14 dňoch reserves=${s14.reserves}`);
    assert.strictEqual(s21.reserves, 2, `po 21 dňoch reserves=${s21.reserves}, strop je 2`);
  });

  test('dnešný nedokončený deň sériu nepretrhne', () => {
    const done = [MON, addDays(MON, 1)];
    const notYetToday = addDays(MON, 2);
    const s = pick.streakState(done, notYetToday);
    assert.strictEqual(s.days, 2, `days=${s.days}`);
  });

  for (const { name, fn } of cases) {
    try {
      fn();
      console.log(`OK   ${name}`);
    } catch (e) {
      console.error(`FAIL ${name}: ${e.message}`);
      failed++;
    }
  }
  console.log(failed ? `FAIL --streak: ${failed}/${cases.length}` : `OK --streak: ${cases.length}/${cases.length}`);
  process.exit(failed ? 1 : 0);
}

// -- vstupny bod ----------------------------------------------------------

const args = process.argv.slice(2);
if (args.includes('--daily')) runDailyCheck();
else if (args.includes('--streak')) runStreakCheck();
else {
  const files = args.filter(a => !a.startsWith('--'));
  runValidate(files.length ? files : DEFAULT_BANKS);
}

module.exports = { validateBank };
