# 01 · Architektúra v2

Predpoklady z `00-KONTEXT.md`: tá istá URL, statický runtime, Firebase až v druhom
kroku, žiadne osobné údaje.

## Repo layout

```
index.html          tabuľa + hra, jeden dokument
style.css
stops.js            bez zmeny — stále jediný zdroj termínov
main.js             odpočet; pribudne rohová varianta a zúženie interakcie
quiz.js             denná päťka: výber, vyhodnotenie, štatistika
store.js            postup: v2.0 localStorage, v2.1 + Firestore adaptér
questions/
  mat.json          banka matematiky (úlohy + ukážky + jednotky)
  sjl.json          banka slovenčiny
  assets/           obrázky k úlohám, PNG, názov = id úlohy
  check.js          validátor banky, `node questions/check.js`
tools/
  fetch.mjs         stiahne PDF podľa zoznamu do source/
  extract.mjs       PDF → draft JSON, beží ručne, výstup sa commituje
source/             PDF originály — gitignored, zoznam URL v 02-BANKA-OTAZOK.md
```

Štyri nové runtime súbory a to je celé. `quiz.js` a `store.js` sú oddelené preto, že
`store.js` je jediné miesto, ktoré sa v2.1 dotkne Firebase — nie kvôli vrstvám.

## Frontend technológia

**Zostávame na čistom JS a bez build stepu (rozhodnutie R8 v `00-KONTEXT.md`).**
Úvaha bola legitímna — appka zásadne pribrala funkcionalitu. Tabuľka nižšie je odpoveď
na to, či tá nová funkcionalita je toho typu, ktorý framework rieši:

| Čo Angular prináša | Máme na to problém? |
|---|---|
| Router | 5 pohľadov bez URL stavu; `location.hash` + `switch` = 8 riadkov |
| DI, moduly, služby | jeden dátový zdroj (`store.js`) a jeden konzument |
| Reaktívne šablóny, RxJS | jeden formulár typu „vyber A–D", žiadny stream |
| Typy | reálny prínos — dá sa mať aj JSDoc + `// @ts-check` bez kompilácie |
| Zmena detekcie | **prekáža:** odpočet prepisuje DOM ~100×/s cez `requestAnimationFrame`; v Angulari sa tomu treba vyhnúť cez `ElementRef` a `runOutsideAngular`, teda písať ten istý kód a naokolo |

Cena prechodu: `package.json`, `node_modules`, build, deploy workflow na Pages
(dnes je „súbory v repe = súbory na webe"), ~150–250 kB frameworku k stránke, ktorá
má dnes celá pod 100 kB, a nefunkčná stránka vždy, keď build zhorí.

**Kedy sa vraciame k tejto otázke — merateľné spúšťače:**
- `quiz.js` prejde ~800 riadkov, alebo
- potrebujeme skutočný router s hlbokými odkazmi a stavom v URL, alebo
- pribudne druhá stránka so zdieľanými komponentmi, alebo
- ručná práca s DOM začne byť zdroj chýb (nekonzistentný stav po dvoch pohľadoch).

**Záchranná cesta je Vue 3 z CDN, nie Angular.** Vue má oficiálny no-build režim —
`import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js'`,
šablóny priamo v HTML, reaktivita bez kompilátora. ~50 kB gz, žiadny `package.json`,
žiadny deploy workflow, „súbory v repe = súbory na webe" zostáva.

Prečo Vue a nie `preact` + `htm` (~5 kB, tiež bez buildu): pri piatich pohľadoch
rozhoduje to, čo tu niekto pozná, nie posledných 45 kB. Vue bolo pomenované, tak je
to Vue. Angular je až tretí krok — druhá stránka so zdieľanými komponentmi — a vtedy
je to samostatná fáza s vlastným deploy workflow.

`ponytail: čistý JS + <script type="module">; strop 800 riadkov v quiz.js, potom
Vue 3 ESM z CDN bez buildu, Angular až keď pribudne druhá stránka`

## Rozdelenie zodpovednosti

| Vrstva | Kto | Poznámka |
|---|---|---|
| Hosting stránky | GitHub Pages | bez zmeny |
| Banka otázok | statické JSON v repe | 0 čítaní z DB, 0 nákladov |
| Identita | Firebase Anonymous Auth | v2.1 |
| Postup a štatistika | `localStorage` → Firestore | v2.1, lokálny stav zostáva cache |
| OG náhľad | `.github/workflows/og.yml` | bez zmeny mechaniky |
| Pripomienka | `send.js` | **bez zmeny v v2**, viď nižšie |

## v2.0 — bez backendu

Prvý použiteľný stav nemá Firebase vôbec. `store.js` má rozhranie
`load()` / `saveDay(day)` / `stats()` a implementuje ho nad `localStorage`
v jednom kľúči `odpocet.v1` (JSON, do ~100 kB; limit prehliadača je 5 MB).

Prvá návšteva teda: otvorí → hrá → vidí štatistiku. Bez registrácie, bez čakania.
Výzvu „ulož si postup, aby ti neušiel" ukážeme **až po druhom dokončenom dni**, nie
pri prvom otvorení. Nikto sa neregistruje do niečoho, čo ešte neskúsil.

## v2.1 — Firebase

Anonymous Auth (bez e-mailu, bez hesla) + Firestore. Prihlásenie prebehne na pozadí,
používateľ zadá len prezývku.

> **Rozhodnutie:** v2.1 rieši **zálohu a štatistiku, nie multi-device.** Anonymné
> prihlásenie je viazané na zariadenie a prenos účtu na druhý telefón bez osobného
> údaja alebo vlastného servera nemá čistú cestu (`signInWithCustomToken` potrebuje
> server, `linkWithCredential` potrebuje e-mail = osobný údaj, ktorý nechceme).
> Paulinka má jeden telefón.
> `ponytail: per-zariadenie; ak pribudne požiadavka na druhé, cesta je Google sign-in
> ako voliteľný krok pre toho, kto ho chce`

### Dátový model

`users/{uid}` — jeden dokument, prepisuje sa raz denne:

```json
{
  "nick": "paulinka",
  "created": 1757000000,
  "totals": { "mat": { "seen": 120, "ok": 88 }, "sjl": { "seen": 120, "ok": 101 } },
  "topics": { "mat:zlomky": { "seen": 12, "ok": 5 }, "sjl:pravopis": { "seen": 18, "ok": 16 } },
  "review": { "mat-2019-a-07": { "box": 2, "due": "2026-09-06" } },
  "streak": { "days": 7, "last": "2026-09-01" }
}
```

`users/{uid}/days/{2026-09-01}` — jeden dokument na deň, zapíše sa raz, po dokončení:

```json
{
  "mat": { "ids": ["mat-2019-a-07"], "ok": 4 },
  "sjl": { "ids": ["sjl-2021-b-12"], "ok": 3 },
  "answers": { "mat-2019-a-07": { "a": "C", "ok": false } },
  "done": 1757000000
}
```

`review` rastie len o úlohy, ktoré padli; pri správnej odpovedi v boxe 3 sa záznam maže.
Strop dokumentu je 1 MiB, čo je pri ~40 B na záznam niekoľko tisíc úloh.
`ponytail: pri prekročení sa review odsťahuje do podkolekcie`

### Bezpečnostné pravidlá

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /days/{day} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

Nikde žiadne verejné čítanie. To zároveň znamená, že rebríček **technicky nie je
možný** — a to je zámer, nie obmedzenie (`00-KONTEXT.md`, R6).

### Zmestíme sa do free tieru

Spark plán, Firestore (over v konzole pred F6, čísla sa menia):
1 GiB dát · **50 000 čítaní/deň** · **20 000 zápisov/deň** · 10 GiB prenosu/mesiac.
Anonymous Auth je pri týchto objemoch zadarmo.

Rozpočet na jedného hráča a deň:

| Operácia | Počet | Kedy |
|---|---|---|
| čítanie `users/{uid}` | 1 | pri otvorení |
| čítanie `days/{dnes}` | 1 | pri otvorení, kvôli rozohranému dňu |
| zápis `days/{dnes}` | 1 | **až po dokončení päťky** |
| zápis `users/{uid}` | 1 | tá istá chvíľa |

**2 zápisy a 2 čítania na hráča a deň** → strop je 10 000 dokončených päťok denne.
Paulinka a celá jej škola sú od toho tri poriadky vzdialené.

Pravidlo, ktoré ten rozpočet drží: **odpovede sa počas hrania nikam neposielajú.**
Buferujú sa v pamäti a v `localStorage`, do Firestore idú jedným zápisom na konci.
Zápis po každej odpovedi by bol 10× drahší a pri odchode uprostred by aj tak
nechal nekonzistentný stav.

## Výber dennej päťky

Zadanie: „náhodne vyberať otázky tak, aby to dávalo zmysel". Tri veci to znamenajú.

### 1. Jednotka výberu je skupina, nie úloha

Testy sú stavané po kapitolách: jedna ukážka alebo veľký príklad a k nemu 5+ otázok.
Vybrať jednu otázku zo skupiny znamená prečítať ukážku kvôli jednej odpovedi.
**Jednotka výberu je preto `unit`** — buď samostatná úloha, alebo celá skupina
s jednou ukážkou. Skupina sa nikdy netrhá.

Dôsledok: denná dávka je **5 úloh ±2**. Presná päťka by znamenala trhať skupiny počas
výberu, čo je horšie ako nerovná dávka.

Dve veci to držia v rozsahu 3–7, obe overené self-checkom na 400 dní:

- **Skupina nad 5 úloh sa reže pri zlievaní banky, nie pri výbere.** `tools/merge.mjs`
  rozdelí jednotku na najrovnomernejšie časti s tou istou ukážkou (7 → 4+3). V
  `questions/raw/` zostáva celá — tam je verná kópia testu, kde čítacia ukážka má
  naozaj sedem otázok. Bez tohto rezu dávalo SJL sedem otázok na **60 % dní**, čo už
  nie je „zriedkavé prekročenie", ale iný produkt.
- **Zvyšok priechodu sa pohltí do posledného dňa**, ak sa tým nepresiahne 7. Deň
  s dvoma otázkami je horší než deň so šiestimi. Na pilotnej banke to je 9 % dní nad
  päť, pri plnej banke ~2 %.

### 2. Štyri zdieľané, jedna osobná

Zdieľané štyri sú **odvodené z dátumu**, nie z používateľa — všetci majú v ten deň to
isté. Tým vzniká „dnešná päťka" ako spoločná téma bez jedinej riadky serverového kódu:
spolužiaci si porovnajú výsledok vo vlastnom chate. Rebríček by k tomu pridal
moderáciu, osobné údaje a Firestore čítania a nedodal takmer nič.

Piata je osobná: najviac po termíne z `review`. **Ak nie je čo opakovať, deň zostane
na štyroch** — dobrať celú ďalšiu zdieľanú jednotku by ho mohlo vyhnať nad sedem, a
polovicu jednotky brať nesmieme. Prvé dni teda majú štyri úlohy na predmet a piata
pribudne, len čo je čo opakovať; to je správne poradie, lebo opakovať sa dá až to,
čo už padlo.

### 3. Priechod bankou, opakovanie až po ňom

Banka má po F0 sedem ročníkov, teda **~150 použiteľných úloh na predmet** →
**priechod ~38 dní** (`02-BANKA-OTAZOK.md`). Do marca 2027 sa banka prejde ~5×.
Opakovanie po piatich týždňoch je zámer: presne toľko trvá zabudnutie, a poradie sa
pri každom priechode premieša iným seedom, takže sa nevracia ten istý deň, len tie
isté úlohy.

```js
// questions/*.json nesie predpočítané `units`; EPOCH je deň 0 hry
const EPOCH = Date.UTC(2026, 8, 1);
const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Bratislava' }).format(new Date()); // YYYY-MM-DD
const dayIndex = iso => Math.round((Date.parse(iso + 'T12:00:00Z') - EPOCH) / 864e5);

function daily(bank, di, want = 4) {
  const min = 3, max = 7;
  const nominal = Math.max(1, Math.floor(bank.itemCount / want)); // koľko dní vydrží priechod
  const pass = Math.floor(di / nominal);
  const order = shuffle(bank.units.map((_, i) => i), hash(bank.subject + ':' + pass));

  // Jednotka, ktorá sama spadá do rozsahu, dostane vlastný deň. Zlievať ju s ďalšou
  // by dalo 8-10 úloh; naopak zliatie len malých jednotiek nedá nikdy 1-2.
  const bigDays = [], smallOrder = [];
  for (const u of order) (bank.units[u].ids.length >= min ? bigDays : smallOrder).push(u);
  if (bigDays.length) bigDays.forEach((u, i) => bigDays[i] = [u]);

  const smallDays = [];
  let bucket = [], n = 0;
  for (const u of smallOrder) {
    bucket.push(u); n += bank.units[u].ids.length;
    if (n >= want) { smallDays.push(bucket); bucket = []; n = 0; }
  }
  if (bucket.length) {                    // zvyšok priechodu
    const last = smallDays[smallDays.length - 1];
    const lastSize = last ? last.reduce((s, u) => s + bank.units[u].ids.length, 0) : 0;
    if (n < min && last && lastSize + n <= max) last.push(...bucket);
    else smallDays.push(bucket);
  }

  const days = shuffle([...bigDays, ...smallDays], hash(bank.subject + ':' + pass + ':days'));
  return days[di % days.length];
}
```

`shuffle` je Fisher–Yates so seedovaným `mulberry32`, `hash` je FNV-1a nad stringom —
dohromady 12 riadkov, žiadna závislosť. Rovnaký kód musí byť **deterministický aj
v Node**, aby sa výber dal otestovať bez prehliadača.

`ponytail: dĺžka priechodu sa medzi priechodmi líši o ±1 deň, lebo skupiny majú rôznu
veľkosť. Dôsledok je, že raz za priechod (~2× do roka) sa jedna jednotka zopakuje
skôr. Nikto si to nevšimne; presné delenie by vyžadovalo trhanie skupín.`

### Opakovanie chýb (Leitner-lite)

Tri boxy, intervaly **1 / 3 / 7 dní**. Zlá odpoveď → box 1, `due` = zajtra. Správna
odpoveď na opakovanú úlohu → box +1, `due` = dnes + interval. Správna v boxe 3 →
záznam sa maže. `ponytail: tri boxy, nie SM-2; SM-2 má zmysel od stoviek kariet denne`

## Séria dní — motivácia vrátiť sa zajtra

Inšpirácia je Duolingo: séria, o ktorú človek nechce prísť. Prevzatá je **loss
aversion**, nie ekonomika odznakov (`03-DIZAJN.md`, zábrany proti detskosti).

### Pravidlá

- **Deň sa počíta, keď je dokončená celá dnešná päťka** — teda MAT aj SJL. Polovica
  sa nepočíta; inak by sa séria dala držať odklikaním jedného predmetu.
- **Víkend sériu nepretrhne.** Sobota a nedeľa sa počítajú, ak sa hrá, ale ich
  vynechanie nič nestojí. Toto samo pokrýva „vynechať cez víkend".
- **Rezervy:** za každých 7 započítaných dní pribudne 1 rezerva, držia sa najviac 2.
  Zmeškaný **pracovný** deň sa automaticky pokryje rezervou. Dokopy sa dá vynechať
  piatok + víkond + pondelok a séria drží.
- **Bez rezervy a v pracovný deň sa séria vynuluje** — ale **traťový rekord zostáva
  navždy.** Toto je jediná časť, ktorú Duolingo robí zle: keď človek stratí 40 dní
  a vidí nulu, prestane. Keď vedľa nuly svieti „rekord 40 dní", má kam mieriť.
- **Dnešný nedokončený deň sériu nepretrhne.** Séria padne až zajtra ráno, nie od
  polnoci — inak by appka otvorená o 23:30 hlásila stratu, ktorá ešte nenastala.

### Séria sa neukládá, počíta sa

Kritické rozhodnutie: **séria nie je počítadlo v dokumente, je funkcia množiny
dokončených dní.** Počítadlo driftuje, dá sa rozbiť zmenou času, po synchronizácii
sa rozíde s dátami a nedá sa prepočítať. Funkcia sa prepočíta kedykoľvek a všade
rovnako.

```js
// pick.js — beží v prehliadači aj v Node
const RANKS = [[60,'MEDZINÁRODNÝ'],[30,'INTERCITY'],[14,'EXPRES'],[7,'RÝCHLIK'],[3,'ZRÝCHLENÝ'],[0,'OSOBNÝ']];

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
      // víkend nič nestojí; dnešný deň ešte nie je zmeškaný
    } else if (reserves > 0) {
      reserves--;                       // rezerva pokryje zmeškaný pracovný deň
    } else {
      days = 0;
    }
  }
  return { days, best, reserves, rank: RANKS.find(([n]) => days >= n)[1] };
}
```

`nextDay` a `isWeekend` pracujú s ISO dátumom v pásme Europe/Bratislava, rovnako ako
`today()`. Vstupom je len zoznam dní z `days/` (Firestore) alebo z `localStorage`.

`ponytail: telefón s prestaveným časom si sériu naklikne. Neriešime — je to jeho
vlastná príprava a serverový čas by znamenal backend.`

### Odmena

Odmena nie je mena. Sú to tri veci, ktoré nič nekostujú a všetky vychádzajú
z existujúceho sveta:

1. **Trieda spoja podľa série** — `OSOBNÝ` → `ZRÝCHLENÝ` (3) → `RÝCHLIK` (7) →
   `EXPRES` (14) → `INTERCITY` (30) → `MEDZINÁRODNÝ` (60). Vypísaná na lište tabule
   ako trieda vlaku. Je to nálepka na skutočnom čísle, nie vymyslený level.
2. **Traťový rekord** — najlepšia séria, viditeľná vždy vedľa aktuálnej.
3. **Nová veta pri prekročení triedy** — jedna suchá gratulácia v tóne výpravcu, raz
   za milník. Nie toast, nie konfety.

Lišta výkazu teda hlási napríklad: `SÉRIA 9 DNÍ · RÝCHLIK · REKORD 14 · REZERVA 1`.
Rezerva je viditeľná zámerne — vedomie, že „mám jednu k dobru", je presne to, čo
drží človeka pri appke počas horšieho týždňa.

## Štatistika

Tri obrazovky dát, nič viac:

1. **Po päťke:** koľko z 5 + 5, ktoré padli, správna odpoveď hneď viditeľná.
2. **Prehľad:** úspešnosť MAT a SJL v %, séria dní, posledných 14 dní ako rad
   klapkových buniek (existujúci komponent, nový graf nekreslíme).
3. **Slabé miesta:** tabuľka tém zoradená od najhoršej, **len témy s aspoň 3
   pokusmi** — pri dvoch pokusoch je „50 %" šum. Klik na tému spustí sadu z tej témy.

„Vráť sa k otázkam, čo ti nešli" sú teda dve cesty: automaticky (piata otázka denne)
a ručne (klik na slabú tému). Obe čítajú ten istý `review`.

## OG náhľad v v2

Mechanika `og.yml` sa nemení. Menia sa dve veci:

- `?og=1` renderuje **tabuľovú plochu, nie hru.** Screenshot rozohranej otázky je
  v zozname správ nečitateľný a prezradil by zadanie. Tabuľa v náhľade zostáva
  v plnej veľkosti — rohová varianta platí pre stránku, nie pre náhľad. Je to presne
  to rozdelenie, ktoré `DESIGN.md` už pozná ako Two-Surface Rule.
- `og:description` dostane druhú vetu o dennej päťke. `og:title` **zostáva odpočtom** —
  je to jediné, čo Messenger a Instagram v zozname správ zobrazia.

## WhatsApp pripomienka v v2

**Kód sa nemení, text template áno.** Pôvodné rozhodnutie („nemení sa nič") padlo
po F5b: keď už na tej stránke hra je, pripomienka má na ňu pozvať, nie len hlásiť
odpočet.

`send.js` zostáva nedotknutý, pretože nová veta používa **tie isté dve premenné** —
`{{1}}` je `what` (2. pád zastávky) a `{{2}}` je `left` (odpočet slovami). Zmena je
výhradne v [WhatsApp Manager](https://business.facebook.com/wa/manage/message-templates/),
template `odpocet_pripomienka`, jazyk `sk`:

```
Do {{1}} zostáva {{2}}.

Poď si niečo zopakovať — dnešná päťka z matiky a sloviny je pripravená.

[tlačidlo] Otvoriť test
```

Dve veci, ktoré s tým prichádzajú:

- **Editácia schváleného template ho posiela znova do review** a Meta počet editácií
  za mesiac obmedzuje. Nie je to zmena, ktorú sa dá skúšať iteratívne.
- **Meta môže template preklasifikovať z Utility na Marketing.** Utility je aktualizácia,
  ktorú si príjemca vyžiadal; „poď si zopakovať" znie promo. Marketingové šablóny sa
  účtujú za správu, takže pri jednej správe denne to sú centy, ale prestáva to byť
  nula. Kategóriu, ktorú Meta priradí, si over pri schvaľovaní — to je jediné miesto,
  kde tento projekt môže začať niečo stáť.

**Pozor, v kóde JE kópia toho textu.** `send.js` má `preview()` — reťazec, ktorý sa
neposiela, len vypisuje do logu a do `--test`, aby bolo vidieť, čo pôjde von. Je to
zrkadlo template a **mení sa v tom istom kroku ako template**, inak log tvrdí niečo
iné, než príjemca dostane. Žiadny assert ho nekontroluje, takže test to nezachytí —
je to jediné miesto v projekte, kde sa text môže rozdvojiť.

Testovacia povinnosť z `CLAUDE.md` platí ďalej: po každej zmene `stops.js` alebo
`send.js` beží `node send.js --test`.

Testovacia povinnosť z `CLAUDE.md` platí ďalej: po každej zmene `stops.js` alebo
`send.js` beží `node send.js --test`.

## Výkonový a prevádzkový rozpočet

- Banka: **≤ 300 kB raw na predmet.** Pri prekročení sa delí na `index.json`
  (id, jednotky, témy) + súbory po ročníkoch, ktoré sa dotiahnu len pre dnešných 10 úloh.
  `ponytail: strop 300 kB, cesta je index + ročníky`
- Obrázky úloh: len tie z dnešnej sady, `loading="lazy"`, orezané na obsah.
- Žiadny service worker. Pages posiela `Cache-Control` a `localStorage` drží stav —
  offline-first je ďalšia vec, ktorá sa dá pokaziť.
- Firebase SDK: modulárne `firebase/app` + `auth` + `firestore` ako ESM import z CDN,
  načítané **až keď si používateľ vytvára účet**. Do vtedy váži hra nula bajtov navyše.
