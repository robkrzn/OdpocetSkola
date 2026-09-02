// Postup hraca: v2.0 len localStorage, jeden kluc "odpocet.v1". Bezi v prehliadaci
// aj v Node, rovnakym trikom ako stops.js/pick.js. Tvar stavu zrkadli Firestore
// model z .doc/01-ARCHITEKTURA.md (v2.1), aby ho neskorsi adapter vedel prevziat
// 1:1 - nemen tvar bez zmeny toho dokumentu.

var P = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('./pick.js') : null;
var todayFn = P ? P.today : today;
var streakStateFn = P ? P.streakState : streakState;

// pick.js exportuje len { daily, shuffle, hash, streakState, normalize, today,
// dayIndex, EPOCH } - nextDay/isWeekend v module.exports chybaju (v prehliadaci
// su dostupne ako globaly, v Node cez require nie). pick.js sa nema menit, tak
// tu je maly lokalny duplikat toho isteho bezpecneho triku (UTC + poludnie, aby
// sa vyhlo DST posunu).
// ponytail: 8 riadkov duplikacie namiesto zasahu do pick.js
function nextDayLocal(iso) {
  var d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
function isWeekendLocal(iso) {
  var day = new Date(iso + 'T12:00:00Z').getUTCDay();
  return day === 0 || day === 6;
}
function addDays(iso, n) {
  var d = iso;
  for (var i = 0; i < n; i++) d = nextDayLocal(d);
  return d;
}
function prevDayLocal(iso) {
  var d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

var KEY = 'odpocet.v1';
var BOX_DUE = [1, 3, 7]; // interval v dnoch pre box 1/2/3, indexovane od 0

function defaults() {
  return {
    v: 1,
    nick: '',
    created: Date.now(),
    totals: { mat: { seen: 0, ok: 0 }, sjl: { seen: 0, ok: 0 } },
    topics: {},
    review: {},
    days: {},
    current: null
  };
}

// Zluci nacitany stav s defaultom, aby chybajuce polia (starsia verzia ulozeneho
// stavu) appku nezhodili. parsed === null/undefined znamena "nic tam nebolo".
function withDefaults(parsed) {
  var d = defaults();
  var s = parsed && typeof parsed === 'object' ? parsed : {};
  return {
    v: 1,
    nick: typeof s.nick === 'string' ? s.nick : d.nick,
    created: typeof s.created === 'number' ? s.created : d.created,
    totals: {
      mat: Object.assign({}, d.totals.mat, s.totals && s.totals.mat),
      sjl: Object.assign({}, d.totals.sjl, s.totals && s.totals.sjl)
    },
    topics: Object.assign({}, s.topics),
    review: Object.assign({}, s.review),
    days: Object.assign({}, s.days),
    current: s.current || null
  };
}

// Pamatova kopia pre pripad, ze localStorage hodi vynimku (Safari private mode,
// in-app prehliadac). Pouziva sa LEN ked getItem/setItem zlyha - poskodeny JSON
// v citatelnom kluci je iny pripad (fallback na cisty default, nie na tuto kopiu).
var _mem = null;

function readRaw() {
  try {
    return { ok: true, val: localStorage.getItem(KEY) };
  } catch (e) {
    return { ok: false, val: undefined };
  }
}

function writeState(s) {
  _mem = s;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch (e) {
    // ponytail: setItem zlyhalo, stav zije uz len v _mem pre zvysok tejto session
  }
}

var Store = {};

Store.load = function () {
  var r = readRaw();
  if (!r.ok) {
    var s1 = withDefaults(_mem);
    _mem = s1;
    return s1;
  }
  var parsed = null;
  if (r.val != null) {
    try { parsed = JSON.parse(r.val); } catch (e) { parsed = null; } // poskodeny JSON -> default
  }
  var s = withDefaults(parsed);
  _mem = s;
  return s;
};

Store.saveProgress = function (cur) {
  var s = Store.load();
  s.current = cur;
  writeState(s);
  return s;
};

Store.saveDay = function (day) {
  var s = Store.load();
  if (s.days[day.date]) {
    // uz zapocitane - idempotentne, len zavrieme rozohrany den
    s.current = null;
    writeState(s);
    return s;
  }

  var mat = { ids: (day.sets && day.sets.mat) || [], ok: 0 };
  var sjl = { ids: (day.sets && day.sets.sjl) || [], ok: 0 };
  var buckets = { mat: mat, sjl: sjl };
  var answers = day.answers || {};

  for (var id in answers) {
    if (!Object.prototype.hasOwnProperty.call(answers, id)) continue;
    var a = answers[id];
    var subj = a.subject;

    if (s.totals[subj]) {
      s.totals[subj].seen++;
      if (a.ok) s.totals[subj].ok++;
    }
    if (buckets[subj] && a.ok) buckets[subj].ok++;

    if (a.topic) {
      var tkey = subj + ':' + a.topic;
      var t = s.topics[tkey] || (s.topics[tkey] = { seen: 0, ok: 0 });
      t.seen++;
      if (a.ok) t.ok++;
    }

    // Leitner-lite: 3 boxy, intervaly 1/3/7 dni (.doc/01-ARCHITEKTURA.md)
    if (!a.ok) {
      s.review[id] = { box: 1, due: addDays(day.date, 1) };
    } else {
      var entry = s.review[id];
      if (entry) {
        if (entry.box >= 3) {
          delete s.review[id];
        } else {
          var newBox = entry.box + 1;
          s.review[id] = { box: newBox, due: addDays(day.date, BOX_DUE[newBox - 1]) };
        }
      }
      // spravna odpoved na ulohu mimo review -> nic
    }
  }

  s.days[day.date] = { mat: mat, sjl: sjl, done: Date.now() };
  s.current = null;
  writeState(s);
  return s;
};

Store.stats = function () {
  var s = Store.load();
  var pctOf = function (t) { return t.seen ? Math.round(100 * t.ok / t.seen) : 0; };

  var topics = [];
  for (var key in s.topics) {
    if (!Object.prototype.hasOwnProperty.call(s.topics, key)) continue;
    var t = s.topics[key];
    if (t.seen < 3) continue;
    var i = key.indexOf(':');
    topics.push({
      key: key,
      subject: key.slice(0, i),
      topic: key.slice(i + 1),
      seen: t.seen,
      ok: t.ok,
      pct: pctOf(t)
    });
  }
  topics.sort(function (x, y) { return x.pct - y.pct || y.seen - x.seen; });

  var doneDates = Object.keys(s.days).sort();
  var td = todayFn();

  var dates14 = [];
  var d = td;
  for (var n = 0; n < 14; n++) { dates14.unshift(d); d = prevDayLocal(d); }

  var doneSet = new Set(doneDates);
  var first = doneDates[0];
  var days14 = dates14.map(function (date) {
    var state;
    if (doneSet.has(date)) state = 'ok';
    else if (date === td) state = 'current';
    // Dni pred prvym odohranym dnom nikto nezmeskal - hrac vtedy este neexistoval.
    // Bez tejto vetvy vita novacika pas s dvanastimi cervenymi krizikmi.
    else if (!first || date < first) state = 'empty';
    else if (isWeekendLocal(date)) state = 'empty';
    else state = 'miss';
    return { date: date, state: state };
  });

  return {
    totals: s.totals,
    pct: { mat: pctOf(s.totals.mat), sjl: pctOf(s.totals.sjl) },
    topics: topics,
    streak: streakStateFn(doneDates, td),
    doneDates: doneDates,
    days14: days14
  };
};

// send.js a og.mjs bezia v Node, kde global var nestaci. V prehliadaci sa preskoci.
if (typeof module !== 'undefined') module.exports = Store;

// -- self-check ---------------------------------------------------------
// node store.js --test
if (typeof require !== 'undefined' && require.main === module && process.argv[2] === '--test') {
  var assert = require('assert');

  function freshLS() {
    var m = new Map();
    return {
      getItem: function (k) { return m.has(k) ? m.get(k) : null; },
      setItem: function (k, v) { m.set(k, String(v)); },
      removeItem: function (k) { m.delete(k); },
      _map: m
    };
  }

  // 1. load() na prazdnom ulozisku vrati default a nespadne
  globalThis.localStorage = freshLS();
  _mem = null;
  var s1 = Store.load();
  assert.strictEqual(s1.totals.mat.seen, 0);
  assert.deepStrictEqual(s1.topics, {});
  assert.strictEqual(s1.current, null);

  // 2. saveProgress + load prezije round-trip
  globalThis.localStorage = freshLS();
  _mem = null;
  var cur = { date: '2026-09-02', subject: 'mat', i: 1, sets: { mat: ['a'], sjl: ['b'] }, answers: {} };
  Store.saveProgress(cur);
  var s2 = Store.load();
  assert.deepStrictEqual(s2.current, cur);

  // 3. saveDay zapocita totals aj topics spravne
  globalThis.localStorage = freshLS();
  _mem = null;
  var day3 = {
    date: '2026-09-02',
    sets: { mat: ['mat-1', 'mat-2'], sjl: ['sjl-1'] },
    answers: {
      'mat-1': { a: 'A', ok: true, topic: 'zlomky', subject: 'mat' },
      'mat-2': { a: 'B', ok: false, topic: 'zlomky', subject: 'mat' },
      'sjl-1': { a: 'C', ok: true, topic: 'pravopis', subject: 'sjl' }
    }
  };
  var s3 = Store.saveDay(day3);
  assert.strictEqual(s3.totals.mat.seen, 2);
  assert.strictEqual(s3.totals.mat.ok, 1);
  assert.strictEqual(s3.totals.sjl.seen, 1);
  assert.strictEqual(s3.totals.sjl.ok, 1);
  assert.deepStrictEqual(s3.topics['mat:zlomky'], { seen: 2, ok: 1 });
  assert.deepStrictEqual(s3.topics['sjl:pravopis'], { seen: 1, ok: 1 });
  assert.strictEqual(s3.days['2026-09-02'].mat.ok, 1);
  assert.strictEqual(s3.days['2026-09-02'].sjl.ok, 1);
  assert.strictEqual(s3.current, null);

  // 4. saveDay je idempotentny (dvakrat ten isty den = tie iste cisla)
  var s4 = Store.saveDay(day3);
  assert.strictEqual(s4.totals.mat.seen, 2);
  assert.strictEqual(s4.totals.mat.ok, 1);
  assert.strictEqual(s4.totals.sjl.seen, 1);

  // 5a. zla odpoved -> box 1, due zajtra (voci datumu dna)
  globalThis.localStorage = freshLS();
  _mem = null;
  var s5a = Store.saveDay({
    date: '2026-09-02',
    sets: { mat: ['mat-3'], sjl: [] },
    answers: { 'mat-3': { a: 'X', ok: false, topic: 'zlomky', subject: 'mat' } }
  });
  assert.deepStrictEqual(s5a.review['mat-3'], { box: 1, due: '2026-09-03' });

  // 5b. spravna na box 1 -> box 2, due = den + 3
  globalThis.localStorage.setItem(KEY, JSON.stringify(Object.assign({}, s5a, {
    review: { 'mat-3': { box: 1, due: '2026-09-03' } }
  })));
  var s5b = Store.saveDay({
    date: '2026-09-10',
    sets: { mat: [], sjl: [] },
    answers: { 'mat-3': { a: 'A', ok: true, topic: 'zlomky', subject: 'mat' } }
  });
  assert.deepStrictEqual(s5b.review['mat-3'], { box: 2, due: '2026-09-13' });

  // 5c. spravna v boxe 3 -> zaznam zmizne
  globalThis.localStorage.setItem(KEY, JSON.stringify(Object.assign({}, s5b, {
    days: {}, // aby dalsi datum nebol uz zapocitany
    review: { 'mat-3': { box: 3, due: '2026-09-13' } }
  })));
  var s5c = Store.saveDay({
    date: '2026-09-20',
    sets: { mat: [], sjl: [] },
    answers: { 'mat-3': { a: 'A', ok: true, topic: 'zlomky', subject: 'mat' } }
  });
  assert.strictEqual(s5c.review['mat-3'], undefined);

  // 6. stats().topics filtruje seen < 3 a radi od najhorsej
  globalThis.localStorage = freshLS();
  _mem = null;
  Store.saveProgress(null);
  var seeded = Store.load();
  seeded.topics = {
    'mat:zlomky': { seen: 5, ok: 1 },   // 20 %
    'mat:geometria': { seen: 4, ok: 3 },// 75 %
    'sjl:pravopis': { seen: 2, ok: 2 }  // pod prahom, vypadne
  };
  writeState(seeded);
  var s6 = Store.stats();
  assert.strictEqual(s6.topics.length, 2);
  assert.strictEqual(s6.topics[0].key, 'mat:zlomky');
  assert.strictEqual(s6.topics[1].key, 'mat:geometria');

  // 7. stats().days14 ma 14 polozok a konci dneskom
  var s7 = Store.stats();
  assert.strictEqual(s7.days14.length, 14);
  assert.strictEqual(s7.days14[13].date, todayFn());

  // 8. poskodeny JSON v kluci -> default, bez vynimky
  globalThis.localStorage = freshLS();
  _mem = { totals: { mat: { seen: 99, ok: 99 }, sjl: { seen: 0, ok: 0 } } }; // nesmie preciect
  globalThis.localStorage.setItem(KEY, '{nie je to json');
  var s8 = Store.load();
  assert.strictEqual(s8.totals.mat.seen, 0);

  // 9. bonus: localStorage hadze vynimku -> pouzije sa pamatova kopia, appka nespadne
  _mem = null;
  globalThis.localStorage = freshLS();
  Store.saveProgress({ date: '2026-09-02', subject: 'mat', i: 0, sets: { mat: [], sjl: [] }, answers: {} });
  globalThis.localStorage = {
    getItem: function () { throw new Error('blocked'); },
    setItem: function () { throw new Error('blocked'); }
  };
  var s9a = Store.saveProgress({ date: '2026-09-03', subject: 'sjl', i: 2, sets: { mat: [], sjl: [] }, answers: {} });
  var s9b = Store.load();
  assert.strictEqual(s9a.current.date, '2026-09-03');
  assert.strictEqual(s9b.current.date, '2026-09-03'); // prezilo v _mem aj bez ulozenia

  console.log('\x1b[32m✓ store.js: 9/9 testov OK\x1b[0m');
}
