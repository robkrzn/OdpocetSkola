/* Denna patka: vyber nad pick.js, vyhodnotenie, vysledok, vykaz.
   Bez frameworku a bez routera - pat pohladov je switch nad location.hash
   (.doc/01-ARCHITEKTURA.md, "Frontend technologia"). Postup drzi store.js,
   vyber a seriu pick.js; tento subor je len hra a jej DOM.

   ponytail: cely stav je jeden objekt `day` a jeden `play`; strop je 800
   riadkov v tomto subore, potom Vue 3 ESM z CDN bez buildu. */

(function () {
  'use strict';

  // Nahlad linku renderuje tabulovu plochu, nie hru (Two-Surface Rule).
  if (OG) return;

  var SUBJECTS = ['mat', 'sjl'];
  var NAME = { mat: 'Matematika', sjl: 'Slovenčina' };
  var SHORT = { mat: 'Mat', sjl: 'Sjl' };
  var GEN = { mat: 'Matematika vypravená', sjl: 'Slovenčina vypravená' };
  var LETTERS = 'ABCD';
  var VIEWS = ['dnes', 'uloha', 'vysledok', 'vykaz', 'tabula'];

  // Slugy tem su uzavrety zoznam z .doc/02-BANKA-OTAZOK.md (a questions/check.js).
  // Vykaz ich ukazuje cloveku, takze potrebuju ludske meno; odvodit ho zo slugu
  // sa neda - pomlcka je raz "a", raz len oddelovac.
  var TOPIC = {
    'zlomky-desatinne': 'Zlomky a desatinné čísla',
    'percenta-pomer': 'Percentá a pomer',
    'mocniny-odmocniny': 'Mocniny a odmocniny',
    'vyrazy-rovnice': 'Výrazy a rovnice',
    'slovne-ulohy': 'Slovné úlohy',
    'umernost-trojclenka': 'Úmernosť a trojčlenka',
    'rovinne-obrazce': 'Rovinné útvary',
    'telesa': 'Telesá',
    'uhly-konstrukcie': 'Uhly a konštrukcie',
    'pytagorova-veta': 'Pytagorova veta',
    'funkcie-grafy': 'Funkcie a grafy',
    'statistika-pravdepodobnost': 'Štatistika a pravdepodobnosť',
    'kombinatorika-logika': 'Kombinatorika a logika',
    'jednotky-premeny': 'Jednotky a premeny',
    'pravopis': 'Pravopis',
    'hlaskoslovie': 'Hláskoslovie',
    'tvaroslovie': 'Tvaroslovie',
    'slovna-zasoba': 'Slovná zásoba',
    'skladba': 'Skladba',
    'sloh-postupy': 'Slohové postupy',
    'literarna-teoria': 'Literárna teória',
    'poetika': 'Poetika',
    'porozumenie-textu': 'Porozumenie textu',
    'autori-diela': 'Autori a diela',
    'komunikacia': 'Komunikácia'
  };

  var $ = function (id) { return document.getElementById(id); };
  var screen = $('screen');

  var banks = null;          // {mat, sjl} - dotiahnute az ked ich hra potrebuje
  var byId = {};             // id ulohy -> {sub, bank, item, stim}
  var state = null;          // store.js
  var day = null;            // {date, sets:{mat,sjl}, answers:{}}
  var play = null;           // rozohrana sada: {subject, ids, i, answers, drill}
  var resultSub = null;      // predmet, ktoreho vysledok sa prave ukazuje
  var sel = null;            // vybrana moznost pred potvrdenim
  var rows = [], flaps = [], input = null;
  var view = 'dnes';
  var ctaFn = null;

  /* --- pomocne ---------------------------------------------------------- */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function pl(n, one, few, many) { return n === 1 ? one : (n >= 2 && n <= 4 ? few : many); }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function setCta(label, fn, off) {
    var bar = $('thumbBar');
    if (!label) { bar.hidden = true; ctaFn = null; return; }
    bar.hidden = false;
    $('cta').textContent = label;
    $('cta').disabled = !!off;
    ctaFn = fn;
  }

  $('cta').addEventListener('click', function () { if (ctaFn) ctaFn(); });

  /* --- banka a dnesna patka --------------------------------------------- */

  function index() {
    SUBJECTS.forEach(function (sub) {
      var b = banks[sub];
      b.units.forEach(function (u) {
        u.ids.forEach(function (id) {
          byId[id] = { sub: sub, bank: b, item: b.items[id], stim: u.stimulus };
        });
      });
    });
  }

  function buildSets(di, td) {
    var out = {};
    SUBJECTS.forEach(function (sub) {
      var b = banks[sub];
      var ids = daily(b, di, 4).reduce(function (a, u) { return a.concat(b.units[u].ids); }, []);

      // Piata je osobna: najviac po termine z review. Ked nie je co opakovat,
      // den zostane na styroch - denna davka je 5 +-2 a dobrat cely dalsi unit
      // by ju vyhnalo nad sedem (.doc/01-ARCHITEKTURA.md, "Vyber dennej patky").
      var due = Object.keys(state.review).filter(function (id) {
        return byId[id] && byId[id].sub === sub && ids.indexOf(id) < 0 &&
               state.review[id].due <= td;
      }).sort(function (x, y) {
        return state.review[x].due < state.review[y].due ? -1 : 1;
      });
      if (due.length) ids.push(due[0]);

      out[sub] = ids;
    });
    return out;
  }

  function ensureDay() {
    var td = today();
    if (state.days[td]) { day = null; return; }        // dnesok je uz vypraveny
    if (state.current && state.current.date === td) { day = state.current; return; }
    // Nedokonceny vcerajsi den sa zahadzuje: patka je viazana na datum a
    // dohrat ju spatne by rozbilo aj zdielanost dnesnej patky, aj seriu.
    day = { date: td, sets: buildSets(Math.max(0, dayIndex(td)), td), answers: {} };
    state = Store.saveProgress(day);
  }

  function nextPending() {
    if (!day) return null;
    for (var i = 0; i < SUBJECTS.length; i++) {
      var sub = SUBJECTS[i], ids = day.sets[sub];
      for (var j = 0; j < ids.length; j++) if (!(ids[j] in day.answers)) return { sub: sub, i: j };
    }
    return null;
  }

  function subDone(sub) {
    return day && day.sets[sub].every(function (id) { return id in day.answers; });
  }

  function okCount(ids) {
    return ids.filter(function (id) { return day.answers[id] && day.answers[id].ok; }).length;
  }

  /* --- klapkove pasy ----------------------------------------------------- */

  function pip(cls, glyph) {
    return '<li class="flap ' + cls + '"><div class="fh fh--t"><i>' + glyph +
           '</i></div><div class="fh fh--b"><i>' + glyph + '</i></div></li>';
  }

  function stripHtml(ids, answers, at) {
    return ids.map(function (id, i) {
      var a = answers[id];
      if (a) return pip(a.ok ? 'pip--ok' : 'pip--miss', a.ok ? '✓' : '✕');
      return i === at ? pip('pip--current', '&nbsp;') : pip('pip--empty', '–');
    }).join('');
  }

  function stripSr(ids, answers) {
    var done = ids.filter(function (id) { return answers[id]; }).length;
    var ok = ids.filter(function (id) { return answers[id] && answers[id].ok; }).length;
    return done + ' z ' + ids.length + ' vypravených, ' + ok + ' správne, ' + (done - ok) + ' zmeškaných.';
  }

  /* --- ukazka ------------------------------------------------------------ */

  // Banka je nas vlastny artefakt v repe (questions/*.json), nie vstup od
  // pouzivatela - tabulky su v nej ako HTML, prepisane z PDF kvoli citackam.
  // Ziadny iny zdroj sa do tejto funkcie nedostane.
  function paras(t) {
    return t.split(/\n\s*\n/).map(function (p) {
      p = p.trim();
      return p ? '<p>' + p.replace(/\n/g, '<br>') + '</p>' : '';
    }).join('');
  }

  function stimBody(txt) {
    var out = '', re = /<table[\s\S]*?<\/table>/g, last = 0, m;
    while ((m = re.exec(txt))) {
      out += paras(txt.slice(last, m.index));
      out += '<div class="stimulus__table-wrap">' + m[0] + '</div>';
      last = m.index + m[0].length;
    }
    return out + paras(txt.slice(last));
  }

  function stimulusHtml(e, id) {
    if (!e.stim) return '';
    var s = e.bank.stimuli[e.stim];
    // Ukazku clovek precita RAZ. Rozbalena je len pri prvej otazke skupiny;
    // od druhej je z nej jeden prispendleny riadok (.doc/03-DIZAJN.md).
    var first = play.ids.filter(function (x) { return byId[x] && byId[x].stim === e.stim; })[0] === id;
    return '<details class="stimulus"' + (first ? ' open' : '') + '>' +
      '<summary class="stimulus__label">Ukážka <span aria-hidden="true">·</span> <em>' +
        esc(s.title || '') + '</em></summary>' +
      '<div class="stimulus__scroll">' +
        (s.title ? '<p class="role-body stimulus__heading">' + esc(s.title) + '</p>' : '') +
        '<div class="stimulus__body role-body">' + stimBody(s.body) + '</div>' +
      '</div></details>';
  }

  // Ukazka sa lepi pod chrom, takze potrebuje jeho skutocnu vysku. Napevno
  // zapisana hodnota v CSS sa rozide s realitou pri kazdej zmene pisma alebo
  // sirky a medzi hlavickou a ukazkou ostane pruh steny.
  function syncHead() {
    document.body.style.setProperty('--head-h',
      Math.round($('appHead').getBoundingClientRect().height) + 'px');
  }
  addEventListener('resize', function () { if (view === 'uloha') syncHead(); });

  // Ukazka, ktora sa cela zmesti, nema co orezavat - bez tohto by jej stopku
  // (gradient na spodku) dostal aj tri riadky dlhy text.
  function fitStimulus() {
    var d = screen.querySelector('.stimulus');
    if (!d) return;
    var sc = d.querySelector('.stimulus__scroll');
    var measure = function () {
      d.classList.remove('stimulus--static');
      if (d.open && sc.scrollHeight <= sc.clientHeight + 1) d.classList.add('stimulus--static');
    };
    d.addEventListener('toggle', measure);
    measure();
  }

  /* --- zdroj ulohy -------------------------------------------------------- */

  function sourceHtml(e, it) {
    var src = it.source || {};
    var row = (e.bank.sources || []).filter(function (s) {
      return s.year === src.year && s.form === src.form;
    })[0];
    var txt = SHORT[e.sub] + ' · ' + src.year + ' · forma ' + src.form + ' · úloha ' + src.n + ' · nucem.sk';
    if (!row || !row.test) return '<span class="task-panel__source">' + esc(txt) + '</span>';
    return '<a class="task-panel__source" href="' + esc(row.test) + '" target="_blank" rel="noopener">' +
           esc(txt) + '</a>';
  }

  /* --- pohlad: uloha ------------------------------------------------------ */

  function renderTask() {
    var id = play.ids[play.i], e = byId[id], it = e.item;
    var given = play.answers[id];

    $('strip').innerHTML = stripHtml(play.ids, play.answers, play.i);
    $('stripSr').textContent = 'Úloha ' + (play.i + 1) + ' z ' + play.ids.length + '. ' +
      stripSr(play.ids, play.answers);

    var body = '<p class="role-body task-panel__prompt">' + esc(it.text) + '</p>';

    if (it.type === 'mc') {
      body += '<ul class="options"></ul>';
      body += '<p class="hint">1–4 alebo A–D vyberá · Enter potvrdí</p>';
    } else {
      body += '<div class="answer-field">' +
        '<input type="text" id="ans"' + (it.type === 'num' ? ' inputmode="decimal"' : '') +
        ' placeholder="' + (it.type === 'num' ? '0' : 'napíš slovo') +
        '" aria-label="Odpoveď" autocomplete="off"></div>';
      body += '<p class="hint">Enter potvrdí</p>';
    }
    // Odchylka od kompu (schvalena): riadok zdroja stoji POD moznostami. V kompe
    // stal medzi zadanim a moznostami a preruboval cestu od otazky k odpovedi.
    body += sourceHtml(e, it);

    screen.innerHTML = '<article class="task-panel">' + stimulusHtml(e, id) +
      '<div class="task-panel__body">' + body + '</div></article>';

    syncHead();
    fitStimulus();
    rows = []; flaps = []; input = null; sel = null;

    if (it.type === 'mc') {
      var ul = screen.querySelector('.options');
      it.options.forEach(function (txt, i) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.className = 'option-row'; b.type = 'button'; b.dataset.i = i;
        li.appendChild(b); ul.appendChild(li);
        var f = new Flap(b);          // klapkova bunka A-D; pri vyhodnoteni sa preklopi
        f.put(LETTERS[i]);
        var sp = document.createElement('span');
        sp.className = 'role-option'; sp.textContent = txt;
        b.appendChild(sp);
        rows.push(b); flaps.push(f);
      });
      ul.addEventListener('click', function (ev) {
        var b = ev.target.closest('.option-row');
        if (b && !b.disabled) select(+b.dataset.i);
      });
    } else {
      input = $('ans');
      if (given) input.value = given.a;
    }

    if (given) { paint(given); return; }
    setCta('Potvrdiť', submit, it.type === 'mc');
  }

  function select(i) {
    sel = i;
    rows.forEach(function (b, k) { b.classList.toggle('option-row--selected', k === i); });
    rows.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    $('cta').disabled = false;
  }

  function accepts(it, v) {
    var n = normalize(v);
    if (n === normalize(it.answer)) return true;
    return (it.accept || []).some(function (a) { return normalize(a) === n; });
  }

  function submit() {
    var id = play.ids[play.i], e = byId[id], it = e.item;
    if (play.answers[id]) return next();

    var a;
    if (it.type === 'mc') {
      if (sel === null) return;
      a = LETTERS[sel];
    } else {
      a = input.value.trim();
      if (!a) return;
    }
    var ok = it.type === 'mc' ? a === it.answer : accepts(it, a);

    play.answers[id] = { a: a, ok: ok, topic: it.topic, subject: e.sub };
    // Odpovede sa buferuju a do Firestore pojdu jednym zapisom po dokonceni dna
    // (F6). Do localStorage sa pisu hned - postup musi prezit zatvorenie
    // prehliadaca uprostred patky.
    if (!play.drill) state = Store.saveProgress(day);
    paint(play.answers[id]);
  }

  // Stav odpovede nikdy nie je len farba ani len jasnost: vzdy aj glyf.
  function paint(a) {
    var id = play.ids[play.i], it = byId[id].item;

    if (it.type === 'mc') {
      var ci = it.answer.charCodeAt(0) - 65;
      var mine = LETTERS.indexOf(a.a);
      rows.forEach(function (b, i) {
        b.disabled = true;
        b.classList.remove('option-row--selected');
        if (i === ci && a.ok) { b.classList.add('option-row--correct'); flaps[i].set('✓'); }
        else if (i === ci) b.classList.add('option-row--reveal');
        if (i === mine && !a.ok) { b.classList.add('option-row--wrong'); flaps[i].set('✕'); }
      });
    } else {
      input.disabled = true;
      var p = document.createElement('p');
      p.className = 'role-answer answer-verdict' + (a.ok ? '' : ' answer-verdict--miss');
      p.innerHTML = '<span class="answer-verdict__g" aria-hidden="true">' + (a.ok ? '✓' : '✕') + '</span>' +
        '<span>' + (a.ok ? 'Správne' : 'Zmeškané, správne je ' + esc(it.answer)) + '</span>';
      screen.querySelector('.answer-field').after(p);
    }

    // Ten isty riadok, len uz hovori o dalsom kroku - prepis textu namiesto
    // odobratia, aby sa po potvrdeni nic neposunulo.
    var hint = screen.querySelector('.hint');
    if (hint) hint.textContent = 'Enter · ďalej';

    $('strip').innerHTML = stripHtml(play.ids, play.answers, play.i);
    $('stripSr').textContent = stripSr(play.ids, play.answers);
    setCta(play.i + 1 < play.ids.length ? 'Ďalej' : 'Výsledok', next);
  }

  function next() {
    if (play.i + 1 < play.ids.length) { play.i++; render(); scrollTo(0, 0); return; }
    if (play.drill) { play = null; go('#/vykaz'); return; }

    resultSub = play.subject;
    play = null;
    // Den sa zapocita do serie az ked su hotove OBA predmety - polovica
    // by sa dala odklikat (.doc/01-ARCHITEKTURA.md, "Seria dni").
    if (SUBJECTS.every(subDone)) {
      state = Store.saveDay({ date: day.date, sets: day.sets, answers: day.answers });
    }
    go('#/vysledok');
  }

  /* --- pohlad: vysledok ---------------------------------------------------- */

  function renderResult() {
    if (!day || !resultSub) { go('#/dnes'); return; }
    var ids = day.sets[resultSub], ok = okCount(ids);

    // Sekcny popisok je namalovana signage na stene; hodnoty a zoznamy sedia
    // v puzdre, delene tou istou hairlinou ako pasy tabule (Recess Rule).
    var h = '<p class="section-cap">' + GEN[resultSub] + '</p>' +
      '<section class="panel"><div class="panel__band">' +
        '<div class="rail"><span class="rail__key">Vypravené</span>' +
          '<span class="rail__val">' + ok + ' / ' + ids.length + '</span></div>' +
        '<ol class="progress-strip" aria-hidden="true">' +
          stripHtml(ids, day.answers, -1) + '</ol>' +
        '<p class="sr">' + NAME[resultSub] + ': ' + stripSr(ids, day.answers) + '</p>' +
      '</div>';

    var missed = ids.filter(function (id) { return !day.answers[id].ok; });
    if (missed.length) {
      h += '<div class="rule"></div><div class="panel__band">' +
        '<p class="panel__cap">Zmeškané spoje</p><ul class="topics">';
      missed.forEach(function (id) {
        var it = byId[id].item;
        h += '<li><div class="topic-row" style="cursor:default"><div>' +
          '<p class="role-body" style="margin:0 0 6px">' + esc(it.text) + '</p>' +
          '<p class="role-answer" style="margin:0">Správne: ' + esc(it.answer) + '</p>' +
          '</div></div></li>';
      });
      h += '</ul></div>';
    }
    screen.innerHTML = h + '</section>';

    var pending = nextPending();
    if (pending) setCta('Pokračovať · ' + SHORT[pending.sub].toUpperCase(), function () {
      startDay(pending.sub, pending.i);
    });
    else setCta('Výkaz', function () { go('#/vykaz'); });
  }

  /* --- pohlad: dnes -------------------------------------------------------- */

  function renderToday() {
    var st = Store.stats();
    // Dva predmety su dva spoje, takze nesu ten isty rail ako lista tabule:
    // ciel vlavo, pocet vpravo. Pod nim vlastny pas postupu.
    var h = '<p class="section-cap">Dnešný spoj</p><section class="panel">' +
      '<div class="panel__band">';

    if (!day) {
      // Po dokonceni uz `day` nezije - store.js drzi len ids a pocty. Konkretne
      // odpovede uz clovek videl na vysledku, tu staci, ze je vypraveny.
      // Ktore konkretne boli spravne, uz store.js nedrzi - len ids a pocty.
      // Pas postupu by teda musel klamat, takze tu nie je: dva raily stacia.
      var rec = state.days[today()];
      SUBJECTS.forEach(function (sub) {
        h += '<div class="rail"' + (sub === 'sjl' ? ' style="margin-top:12px"' : '') + '>' +
          '<span class="rail__key">' + NAME[sub] + '</span>' +
          '<span class="rail__val">' + rec[sub].ok + ' / ' + rec[sub].ids.length + '</span></div>';
      });
      h += '<p class="role-body" style="margin:18px 0 0">Dnešok je vypravený.</p>';
    } else {
      SUBJECTS.forEach(function (sub) {
        var ids = day.sets[sub], at = -1;
        for (var i = 0; i < ids.length; i++) if (!(ids[i] in day.answers)) { at = i; break; }
        h += '<div class="rail"><span class="rail__key">' + NAME[sub] + '</span>' +
          '<span class="rail__val">' +
          ids.filter(function (id) { return id in day.answers; }).length + ' / ' + ids.length +
          '</span></div><ol class="progress-strip" aria-hidden="true">' +
          stripHtml(ids, day.answers, at) + '</ol>' +
          '<p class="sr">' + NAME[sub] + ': ' + stripSr(ids, day.answers) + '</p>';
      });
    }

    h += '</div><div class="rule"></div><div class="panel__band">' +
      streakLine(st) + '</div></section>';
    screen.innerHTML = h;

    var pending = nextPending();
    if (!pending) setCta('Výkaz', function () { go('#/vykaz'); });
    else setCta((Object.keys(day.answers).length ? 'Pokračovať · ' : 'Začať · ') +
      SHORT[pending.sub].toUpperCase(), function () { startDay(pending.sub, pending.i); });
  }

  function startDay(sub, i) {
    play = { subject: sub, ids: day.sets[sub], i: i, answers: day.answers, drill: false };
    go('#/uloha');
  }

  /* --- pohlad: vykaz ------------------------------------------------------- */

  function streakLine(st, style) {
    var s = st.streak, at = style ? ' style="' + style + '"' : '';
    // Prve otvorenie: SERIA 0 DNI · OSOBNY · REKORD 0 · REZERVA 0 vyzera ako
    // pokazeny vykaz, nie ako cisty start - styri nuly su styri chybajuce
    // hodnoty. Kym nie je vypraveny ani jeden den, seria nema co ukazat a
    // hovori to jednou vetou.
    if (!st.doneDates.length) {
      return '<p class="report-line"' + at + '>' +
        '<span>Séria začína prvým vypraveným dňom</span></p>';
    }
    return '<p class="report-line"' + at + '>' +
      '<span>Séria <strong>' + s.days + ' ' + pl(s.days, 'deň', 'dni', 'dní') + '</strong></span>' +
      '<span><strong>' + s.rank + '</strong></span>' +
      '<span>Rekord <strong>' + s.best + '</strong></span>' +
      '<span>Rezerva <strong>' + s.reserves + '</strong></span></p>';
  }

  function renderReport() {
    var st = Store.stats();
    // Jedno puzdro, tri pasy, dve hairliny - ta ista gramatika ako tabula.
    var h = '<section class="panel"><div class="panel__band">' + streakLine(st);

    h += '<ol class="day-strip" aria-hidden="true">' + st.days14.map(function (d) {
      if (d.state === 'ok') return pip('pip--ok', '✓');
      if (d.state === 'miss') return pip('pip--miss', '✕');
      if (d.state === 'current') return pip('pip--current', '&nbsp;');
      return pip('pip--empty', '–');
    }).join('') + '</ol>';
    h += '<p class="sr">Posledných 14 dní: ' +
      st.days14.filter(function (d) { return d.state === 'ok'; }).length + ' dokončených, ' +
      st.days14.filter(function (d) { return d.state === 'miss'; }).length + ' zmeškaných.</p>';

    h += '</div><div class="rule"></div><div class="panel__band">' +
      '<p class="panel__cap">Úspešnosť</p><div class="stat-row">';
    SUBJECTS.forEach(function (sub) {
      // Bez jedinej odpovede je "0 %" nad "0 / 0" tvrdenie o niecom, co sa
      // nestalo. Pomlcka je chybajuca hodnota, nula je zla hodnota.
      var t = st.totals[sub];
      h += '<div class="stat"><span class="stat__cap">' + SHORT[sub] + '</span>' +
        '<span class="role-stat">' + (t.seen ? st.pct[sub] + ' %' : '–') + '</span>' +
        (t.seen ? '<span class="report-line" style="font-weight:400">' + t.ok + ' / ' +
          t.seen + '</span>' : '') + '</div>';
    });
    h += '</div></div>';

    h += '<div class="rule"></div><div class="panel__band">' +
      '<p class="panel__cap">Slabé linky</p>';
    if (!st.topics.length) {
      h += '<p class="hint">Zatiaľ málo údajov · linka sa objaví po troch úlohách z tej istej témy</p>';
    } else {
      h += '<ul class="topics">';
      st.topics.slice(0, 6).forEach(function (t) {
        h += '<li><button class="topic-row" type="button" data-sub="' + t.subject +
          '" data-topic="' + esc(t.topic) + '"><span class="topic-row__name">' +
          SHORT[t.subject] + ' · ' + esc(TOPIC[t.topic] || t.topic) + '</span>' +
          '<span class="topic-row__frac">' + t.ok + ' / ' + t.seen + '</span></button></li>';
      });
      h += '</ul><p class="hint">Klik na linku spustí sadu z tejto témy.</p>';
    }

    screen.innerHTML = h + '</div></section>';
    var list = screen.querySelector('.topics');
    if (list) list.addEventListener('click', function (ev) {
      var b = ev.target.closest('.topic-row');
      if (b) drill(b.dataset.sub, b.dataset.topic);
    });
    setCta(null);
  }

  // Rucna cesta spat k tomu, co neslo. Sada sa nezapocitava do statistiky ani
  // do serie - to su cisla z dokoncenych dni a cvicenie navyse ich menit nema.
  // ponytail: bez vlastneho zapisu; ak sa ukaze, ze drill ma ratat, pribudne
  // v F6 Store.saveDrill vedla saveDay.
  function drill(sub, topic) {
    var b = banks[sub];
    var ids = Object.keys(b.items).filter(function (id) { return b.items[id].topic === topic; });
    if (!ids.length) return;
    play = {
      subject: sub, drill: true, i: 0, answers: {},
      ids: shuffle(ids, hash(topic + ':' + today())).slice(0, 5)
    };
    go('#/uloha');
  }

  /* --- router ------------------------------------------------------------- */

  function render() {
    if (view === 'tabula') { setCta(null); return; }
    if (!banks) {
      screen.innerHTML = '<p class="section-cap">Načítavam banku úloh…</p>';
      setCta(null);
      return;
    }
    if (view === 'uloha') {
      if (!play) {
        var n = nextPending();
        if (!n) { go(day ? '#/vysledok' : '#/dnes'); return; }
        play = { subject: n.sub, ids: day.sets[n.sub], i: n.i, answers: day.answers, drill: false };
      }
      return renderTask();
    }
    if (view === 'vysledok') return renderResult();
    if (view === 'vykaz') return renderReport();
    renderToday();
  }

  function route() {
    var name = location.hash.replace(/^#\/?/, '');
    if (VIEWS.indexOf(name) < 0) name = 'dnes';
    if (name !== 'uloha') play = null;
    view = name;
    document.body.className = 'view-' + name;
    [].forEach.call(document.querySelectorAll('.tabs a'), function (a) {
      if (a.dataset.view === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    // Tabula sa vzdy otvara kaskadou a bezi na rAF; hra na sekundovom tiku.
    if (name === 'tabula') cascade();
    schedule();
    render();
  }

  addEventListener('hashchange', route);

  /* --- klavesnica ---------------------------------------------------------- */

  document.addEventListener('keydown', function (e) {
    if (view !== 'uloha' || !play || e.metaKey || e.ctrlKey || e.altKey) return;
    var id = play.ids[play.i], it = byId[id].item;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (play.answers[id]) next(); else submit();
      return;
    }
    if (play.answers[id] || it.type !== 'mc') return;
    if (e.target.tagName === 'INPUT') return;

    var i = '1234'.indexOf(e.key);
    if (i < 0) i = LETTERS.indexOf(e.key.toUpperCase());
    if (i >= 0 && i < it.options.length) { e.preventDefault(); select(i); }
  });

  /* --- start --------------------------------------------------------------- */

  state = Store.load();
  route();

  Promise.all(SUBJECTS.map(function (s) {
    return fetch('questions/' + s + '.json').then(function (r) { return r.json(); });
  })).then(function (bs) {
    banks = { mat: bs[0], sjl: bs[1] };
    index();
    ensureDay();
    render();
  }).catch(function () {
    screen.innerHTML = '<p class="section-cap">Banka úloh sa nenačítala</p>' +
      '<p class="role-body" style="margin-top:12px">Skús obnoviť stránku. Odpočet beží ďalej ' +
      '<a href="#/tabula" style="color:inherit">na tabuli</a>.</p>';
    setCta(null);
  });
})();
