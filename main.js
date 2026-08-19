/* Odchodova tabula. Jedna hodnota (zostavajuci cas) riadi cele pole. */

// Cielove okamihy. Vzdy s explicitnym offsetom - bez neho by odpocet ukazoval
// iny cas navstevnikovi v inom casovom pasme.
var STOPS = [
  {
    at: '2026-09-02T08:00:00+02:00',      // 1.9. je Den Ustavy SR, vyucovanie zacina v stredu
    dest: ['ŠKOLSKÝ ROK', '2026/2027'],
    name: 'Školský rok 2026/2027',
    rail: '02.09.2026 · 08:00',
    line: 'za tento čas ti začína školský rok'
  },
  {
    at: '2027-03-17T08:00:00+01:00',      // marec je este zimny cas, preto +01:00
    dest: ['TESTOVANIE 9', '17.03.2027'],
    name: 'Testovanie 9',
    rail: '17.03.2027 · 08:00',
    line: 'za tento čas ti začína Testovanie 9'
  }
];

var DEPARTED = [
  'Prázdniny 2026 · odišlo 01.07.',
  'Školský rok 2026/2027 · odišlo 02.09.',
  'Testovanie 9 · odišlo 17.03.'
];

var CLOSED = {
  dest: ['ŽIADNE ĎALŠIE', 'ODCHODY'],
  name: 'žiadny ďalší odchod',
  rail: '—',
  line: 'tabuľa končí prevádzku · viac odchodov nemám'
};

var LINE_W = 13;                       // pevny pocet znakovych buniek v cielovom riadku
var GLYPHS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÁČĎÉÍĽŇÓŠŤÚÝŽ0123456789./';

var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
var OG = new URLSearchParams(location.search).has('og');

STOPS.forEach(function (s) { s.ms = Date.parse(s.at); });

/* --- pomocne ---------------------------------------------------------- */

function pl(n, one, few, many) { return n === 1 ? one : (n >= 2 && n <= 4 ? few : many); }

function pad(s) {
  s = s.slice(0, LINE_W);
  var free = LINE_W - s.length, left = Math.floor(free / 2);
  return new Array(left + 1).join(' ') + s + new Array(free - left + 1).join(' ');
}

function digits(n, w) { return String(n).padStart(w, '0').split(''); }

/* --- klapka ----------------------------------------------------------- */

function Flap(host) {
  host.insertAdjacentHTML('beforeend',
    '<div class="flap">' +
      '<div class="fh fh--t"><i> </i></div>' +
      '<div class="fh fh--b"><i> </i></div>' +
      '<div class="lf lf--d"><i> </i></div>' +
      '<div class="lf lf--u"><i> </i></div>' +
    '</div>');
  this.el = host.lastElementChild;
  var i = this.el.getElementsByTagName('i');
  this.t = i[0]; this.b = i[1]; this.ld = i[2]; this.lu = i[3];
  this.leafD = this.el.children[2];
  this.leafU = this.el.children[3];
  this.v = ' ';
  this.rolling = false;
  this.timer = 0;
}

Flap.prototype.put = function (c) {
  this.v = c;
  this.t.textContent = c;
  this.b.textContent = c;
};

Flap.prototype.set = function (c, force) {
  if (this.rolling && !force) return;
  if (c === this.v && !force) return;
  if (REDUCE) { this.put(c); return; }

  var old = this.v;
  this.v = c;
  this.t.textContent = c;      // horna staticka polovica uz drzi novy znak
  this.b.textContent = old;    // dolna drzi stary, kym ju listok neprekryje
  this.ld.textContent = old;
  this.lu.textContent = c;

  this.leafD.getAnimations().forEach(function (a) { a.cancel(); });
  this.leafU.getAnimations().forEach(function (a) { a.cancel(); });

  this.leafD.animate([
    { transform: 'rotateX(0deg)', opacity: 1, offset: 0 },
    { transform: 'rotateX(-90deg)', opacity: 1, offset: .999 },
    { transform: 'rotateX(-90deg)', opacity: 0, offset: 1 }
  ], { duration: 108, easing: 'cubic-bezier(.5,0,.9,.4)' });

  var self = this;
  var land = this.leafU.animate([
    { transform: 'rotateX(90deg)', opacity: 0, offset: 0 },
    { transform: 'rotateX(90deg)', opacity: 1, offset: .47 },
    { transform: 'rotateX(0deg)', opacity: 1, offset: 1 }
  ], { duration: 230, easing: 'cubic-bezier(.18,.72,.3,1)' });

  land.onfinish = function () { self.b.textContent = self.v; };
};

// Roztoceny listok sa neanimuje - znaky sa len prehadzuju, ako na skutocnej
// tabuli. Az posledny dosadne s plnym preklopenim.
Flap.prototype.roll = function (finalFn, delay) {
  clearTimeout(this.timer);
  if (REDUCE) { this.put(finalFn()); return; }

  var self = this, i = 0, steps = 4 + ((Math.random() * 5) | 0);
  this.rolling = true;
  this.el.classList.add('flap--spin');

  function tick() {
    if (i++ >= steps) {
      self.el.classList.remove('flap--spin');
      self.rolling = false;
      self.set(finalFn(), true);
      return;
    }
    self.put(GLYPHS[(Math.random() * GLYPHS.length) | 0]);
    self.timer = setTimeout(tick, 45);
  }
  this.timer = setTimeout(tick, delay);
};

/* --- zostavenie tabule ------------------------------------------------ */

function fill(host, n) {
  var out = [];
  for (var i = 0; i < n; i++) out.push(new Flap(host));
  return out;
}

var $ = function (id) { return document.getElementById(id); };

var destFlaps = [fill($('dest0'), LINE_W), fill($('dest1'), LINE_W)];
var dayF = fill($('uDay'), 3);
var hrsF = fill($('uHrs'), 2);
var minF = fill($('uMin'), 2);
var secF = fill($('uSec'), 2);
var frcF = fill($('uFrc'), 2);

// Stotiny sa nikdy nepreklopia - menia sa rychlejsie, nez staci listok spadnut.
// Zostavaju roztocene na doraz: znak sa len prehadzuje a bunka je rozmazana.
frcF[0].el.classList.add('flap--spin');
frcF[1].el.classList.add('flap--spin', 'flap--fast');

var clockFlaps = dayF.concat(hrsF, minF, secF);

/* --- zvonec ----------------------------------------------------------- */

var ac = null;

function bell() {
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    if (!ac) ac = new AC();
    if (ac.state === 'suspended') ac.resume();
  } catch (e) { return; }

  var t = ac.currentTime;
  var out = ac.createGain();
  out.gain.setValueAtTime(0.0001, t);
  out.gain.exponentialRampToValueAtTime(0.42, t + 0.004);
  out.gain.exponentialRampToValueAtTime(0.0001, t + 1.7);
  out.connect(ac.destination);

  // neharmonicke zlozky uderu do kovu - skolsky zvonec bez zvukoveho suboru
  [1, 2.02, 2.99, 4.17, 5.44, 6.79].forEach(function (r, i) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = 616 * r;
    g.gain.setValueAtTime(0.9 / (i + 1.5), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7 / (1 + i * 0.55));
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 1.8);
  });
}

/* --- faza ------------------------------------------------------------- */

var phase = -1;
var stop = null;

function switchPhase(p) {
  phase = p;
  stop = STOPS[p] || null;
  var view = stop || CLOSED;

  $('departAt').textContent = view.rail;
  document.querySelector('.rail__k').textContent = stop ? 'Najbližší odchod' : 'Prevádzka ukončená';
  $('goneText').textContent = DEPARTED[p] || DEPARTED[DEPARTED.length - 1];
  $('line').textContent = view.line;
  $('destSr').textContent = 'Cieľ: ' + (stop ? stop.name : view.name) + '.';

  cascade();
}

/* --- kaskada ---------------------------------------------------------- */

function cascade() {
  destFlaps.forEach(function (row, r) {
    var text = pad((stop || CLOSED).dest[r] || '');
    row.forEach(function (f, i) {
      f.roll(function () { return text[i]; }, (r * LINE_W + i) * 18);
    });
  });

  var base = LINE_W * 2 * 18;
  clockFlaps.forEach(function (f, i) {
    f.roll(function () { return f.want || ' '; }, base + i * 26);
  });
}

/* --- slucka ----------------------------------------------------------- */

var lastMin = -1;
var lastTenth = -1;

function write(list, chars) {
  for (var i = 0; i < list.length; i++) {
    list[i].want = chars[i];
    list[i].set(chars[i]);
  }
}

function frame() {
  var now = Date.now();
  var p = 0;
  while (p < STOPS.length && STOPS[p].ms <= now) p++;
  if (p !== phase) switchPhase(p);

  var ms = stop ? Math.max(0, stop.ms - now) : 0;
  var total = Math.floor(ms / 1000);
  var d = Math.floor(total / 86400);
  var h = Math.floor(total / 3600) % 24;
  var m = Math.floor(total / 60) % 60;
  var s = total % 60;
  var frac = (ms % 1000) / 1000;

  write(dayF, digits(Math.min(d, 999), 3));
  write(hrsF, digits(h, 2));
  write(minF, digits(m, 2));
  write(secF, digits(s, 2));

  // pri obmedzenom pohybe vzorkujeme stotiny 10x za sekundu namiesto kazdeho snimku
  var tenth = Math.floor(frac * 10);
  if (!REDUCE || tenth !== lastTenth) {
    lastTenth = tenth;
    var hc = digits(Math.floor(frac * 100), 2);
    frcF[0].put(hc[0]);
    frcF[1].put(hc[1]);
  }

  $('capDay').textContent = pl(d, 'deň', 'dni', 'dní');

  if (m !== lastMin) {
    lastMin = m;
    $('clockSr').textContent = stop
      ? 'Zostáva ' + d + ' ' + pl(d, 'deň', 'dni', 'dní') +
        ', ' + h + ' ' + pl(h, 'hodina', 'hodiny', 'hodín') +
        ' a ' + m + ' ' + pl(m, 'minúta', 'minúty', 'minút') +
        ' do udalosti ' + stop.name + '.'
      : 'Odpočet skončil. Tabuľa nemá ďalší odchod.';
  }

  requestAnimationFrame(frame);
}

/* --- OG nahlad: tabula zamrznuta v kaskade ---------------------------- */

if (OG) {
  // Nahlad linku nesmie tvrdit ziadne konkretne cislo - bolo by od prvej minuty
  // zastarane. Pole casu je preto v pohybe: tabula dosada zlava doprava a
  // stotiny su este roztocene na doraz.
  document.body.classList.add('og');
  phase = 0; stop = STOPS[0];
  destFlaps.forEach(function (row, r) {
    var text = pad(stop.dest[r]);
    row.forEach(function (f, i) { f.put(text[i]); });
  });
  [[dayF, '084', 2.6], [hrsF, '19', 3.8], [minF, '52', 5], [secF, '46', 6.6], [frcF, '73', 9]]
    .forEach(function (g) {
      g[0].forEach(function (f, i) {
        f.put(g[1][i]);
        f.el.style.filter = 'blur(' + g[2] + 'px)';
      });
    });
  $('capDay').textContent = 'dní';
  $('clockSr').textContent = '';
} else {
  requestAnimationFrame(frame);

  // Tap je pouzivatelske gesto, takze prehliadac zvuk povoli. Na iPhone v tichom
  // rezime aj tak nezaznie - preto je zvonec bonus, nie pointa.
  var lastPoke = 0;
  function poke() {
    var n = Date.now();
    if (n - lastPoke < 420) return;   // pointerdown aj click z klavesnice mieria sem
    lastPoke = n;
    cascade();
    bell();
  }
  document.addEventListener('pointerdown', poke);
  $('knob').addEventListener('click', poke);
}
