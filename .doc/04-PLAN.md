# 04 · Plán — fázy, agenti, gate kritériá

Osem fáz. Každá má vlastné vlákno, vlastné vstupné dokumenty a **gate, ktorý
kontroluje opus**. Fáza sa nezačína, kým predchádzajúca gate neprešla.

```
F0 zdroje + právo ─┬─ F1 pilot ťaženia ── F2 validátor+výber ── F3 hromadné ťaženie ─┐
                   └─ F4 dizajn (paralelne, nezávisí od banky) ─────────────────────┬┴─ F5 build v2.0 ── F6 Firebase ── F7 OG+docs
```

F4 beží **paralelne s F1–F3** — dizajn nepotrebuje hotovú banku, potrebuje len vedieť,
aké typy úloh existujú (to určuje schéma z F1).

## Ako sa vlákna riadia

Jedno vlákno je **riaditeľ projektu** a nepíše kód. Jeho úlohy: skontrolovať prácu
dokončenej fázy proti jej gate, prepísať dokumenty v `.doc/` a `CLAUDE.md` podľa toho,
čo sa reálne rozhodlo, a vydať **prompt do nasledujúceho vlákna**. Pracovné vlákna
fázu odrobia a skončia; nerozhodujú o rozsahu.

Cyklus: riaditeľ vydá prompt → pracovné vlákno fázu dokončí → Robert sa vráti
k riaditeľovi → riaditeľ skontroluje gate → buď vráti chyby do toho istého vlákna,
alebo vydá prompt do ďalšieho. Tabuľka „Stav" na konci tohto súboru je jediný záznam,
kde sa projekt nachádza.

Prompt z riaditeľa má vždy tie isté štyri veci: **ktoré `.doc/` súbory prečítať**,
**čo je cieľ**, **do ktorých súborov sa smie zapisovať**, **ako sa výsledok overí**.

## Orchestrácia — kto čo robí

**Sonnet robí:** ťaženie jedného testu z PDF · písanie `check.js` podľa vymenovaného
zoznamu assertov · `store.js` · `pick.js` · mechanické úpravy · zbieranie URL zo
stránok · orezávanie obrázkov.

**Opus robí:** schému a dátový model · bezpečnostné pravidlá Firestore · dizajnovú
fázu (`impeccable`) · **každý gate** · rozhodnutia, ktoré menia dokumenty v `.doc/`.

Prečo tá deliaca čiara: sonnet je spolehlivý všade, kde existuje **vymenovateľné
kritérium prijatia**. Kde kritérium treba vymyslieť, tam je lacnejší opus, ktorý to
vymyslí raz, než sonnet, ktorý to trikrát vymyslí zle.

### Pravidlá, ktoré držia spotrebu nízko

1. **Jeden agent = jeden test = jeden výstupný súbor.** Nikdy nedávaj agentovi celú
   banku ani viac testov naraz.
2. **Agent nevracia obsah, vracia cestu a krátky report** (počet úloh, počet
   vyradených, čo bolo nejasné). Obsah je v súbore, ten si prečíta gate.
3. **Nikdy nečítaj `.output` transkripty agentov.** Prepíšu kontext.
4. **Dva agenti nikdy nepíšu do toho istého súboru.** Preto `questions/raw/<test>.json`
   a zliatie samostatným skriptom.
5. **Chybu vracaj tomu istému agentovi** (`SendMessage`), nie novému — má kontext
   testu aj PDF.
6. Každé zadanie agentovi obsahuje presne tri veci: **ktoré `.doc` súbory prečítať**,
   **ktoré súbory smie zapísať**, **ako sa jeho výstup overí**.

Odhad spotreby: F1 ~150k · F3 ~750k (12 agentov × ~60k) · F5 ~300k · zvyšok pod 200k.

---

## F0 · Zdroje a právo

**Cieľ:** vedieť, odkiaľ ťahať, a mať vybavené právo to zverejniť.

Dve nezávislé vetvy, obe začínajú hneď.

**F0a — zoznam PDF (sonnet, 3 agenti paralelne).** URL sa nedá odvodiť
(`02-BANKA-OTAZOK.md`), musí sa vyzbierať z ročných stránok. Agent 1 roky 2023–2025,
agent 2 roky 2020–2022, agent 3 roky 2017–2019. Každý zapíše svoj blok do vlastného
súboru `.doc/zdroje-<rozsah>.md`, opus ich zlije do `.doc/zdroje.md`.

**F0b — stiahnutie PDF (sonnet, 1 agent).** Podľa zlitého `.doc/zdroje.md` stiahne
všetky PDF do `source/`. Banka je pevné dáta — testy sa počas života appky nemenia,
takže toto je jednorazová operácia a `source/` nikdy nepotrebuje refresh.
Žiadosť na NIVAM nie je súčasťou plánu (rozhodnutie v `00-KONTEXT.md`).

**Gate F0:**
- každý riadok `.doc/zdroje.md` má rok, predmet, formu, URL testu **a URL kľúča**
- každá URL po stiahnutí vráti PDF s textovou vrstvou (`pdftotext` alebo `Read`)
- `source/` je v `.gitignore`, PDF v repe nie sú
- chýbajúce kombinácie sú vypísané, nie mlčky vynechané

**Prompt do vlákna F0a:**
> Prečítaj `.doc/02-BANKA-OTAZOK.md`, sekciu Zdroje. Pre roky RRRR–RRRR prejdi ročné
> stránky `https://www2.nucem.sk/sk/merania/narodne-merania/testovanie-9/roky/RRRR-RRRR`
> a vyzbieraj priame URL na PDF testov a kľúčov pre matematiku a SJL, všetky formy.
> Zapíš iba do `.doc/zdroje-RRRR-RRRR.md` ako markdown tabuľku
> `| rok | predmet | forma | typ (test/kľúč) | URL |`. Nič nevymýšľaj — čo nenájdeš,
> označ `chýba`. Vráť len počet nájdených riadkov a zoznam chýbajúcich kombinácií.

---

## F1 · Pilot ťaženia

**Cieľ:** jeden ročník (2024) MAT + SJL vyťažený bezchybne, a **kalibrovaný prompt**
pre zvyšok.

Toto je najdôležitejšia fáza celého projektu. Ak sa tu schéma alebo prompt netrafí,
F3 vyrobí 16 súborov, ktoré treba zahodiť.

**Agenti:** 2 × sonnet, jeden na test. Každý dostane test PDF + kľúč PDF a schému.

**Výstupy:**
- `questions/raw/mat-2024-a.json`, `questions/raw/sjl-2024-a.json`
- `questions/rejected.md` — vyradené úlohy s dôvodom
- `.doc/prompt-tazenie.md` — finálny prompt pre F3, prepísaný podľa toho, na čom sa
  agenti v pilote potkli
- prípadné doplnenie uzavretého zoznamu tém v `02-BANKA-OTAZOK.md`

**Gate F1 — kontroluje sa CELÝ pilot, nie vzorka:**
- schéma sedí do posledného poľa; `id` podľa vzoru; každé `id` v presne jednej jednotke
- **všetky** `answer` porovnané s kľúčom v PDF — jedna chyba = ťaží sa znova
- zadania porovnané s PDF: preklep sa opraví, vynechaná veta = znova
- ukážky správne priradené k skupinám, žiadna osamotená otázka odkazujúca na chýbajúci
  kontext
- témy z uzavretého zoznamu a vecne správne
- vyradené úlohy sú naozaj neoveriteľné, nie len nepohodlné
- `.doc/prompt-tazenie.md` obsahuje konkrétne poučenia z pilotu, nie generickú inštrukciu

**Prompt do vlákna F1 (na jeden test):**
> Prečítaj `.doc/02-BANKA-OTAZOK.md` celý — hlavne Schéma banky, Uzavretý zoznam tém,
> Čo do banky nevstúpi, Normalizácia odpovedí, Obrázky.
> Vstupy: `source/<test>.pdf` a `source/<kluc>.pdf`. Čítaj ich cez
> `pdftotext -layout -enc UTF-8 <súbor>.pdf -` — nástroj `Read` na PDF v tomto
> prostredí padá, `pdftoppm` nie je nainštalovaný (`.doc/zdroje.md`).
> **Najprv prečítaj titulnú stranu testu a zisti `TESTOVÁ FORMA` a `KÓD TESTU`.**
> Kľúč má dva stĺpce (Forma A a Forma B) s tými istými úlohami v inom poradí — ber
> výhradne stĺpec svojho kódu. Zámena stĺpcov posunie každú odpoveď v teste a nič to
> nenahlási.
> Výstup: zapíš **iba** `questions/raw/<subject>-<rok>-<forma>.json` podľa schémy a
> doplň riadky do `questions/rejected.md`.
> Pravidlá: zadanie prepisuj **verne**, neskracuj a neprepisuj vlastnými slovami.
> Správnu odpoveď ber **výhradne z kľúča**, nikdy neriešiť úlohu samostatne. Ukážku
> zdieľanú viacerými úlohami daj do `stimuli` a úlohy zviaž jednou `unit`. Tabuľku
> prepíš ako HTML `<table>`. Tému vyber z uzavretého zoznamu — nevymýšľaj novú.
> Kde si si nebol istý, zapíš to do reportu.
> Vráť: počet úloh, počet ukážok, počet jednotiek, počet vyradených a zoznam miest,
> kde si si nebol istý. Nevracaj obsah JSON.

---

## F2 · Validátor a výber dennej päťky

**Cieľ:** stroj, ktorý povie, či je banka v poriadku, a deterministický výber, ktorý
sa dá otestovať bez prehliadača.

**Agent:** 1 × sonnet. Vstupy: `01-ARCHITEKTURA.md` (algoritmus), `02-BANKA-OTAZOK.md`
(zoznam assertov).

**Výstupy:**
- `pick.js` — `daily()`, `shuffle()`, `hash()`, `streakState()`, normalizácia
  odpovede. Beží v prehliadači aj v Node, rovnakým trikom ako `stops.js`
  (`if (typeof module !== 'undefined') module.exports = ...`).
- `questions/check.js` — validátor; `--daily` self-check na 400 dní.
- `tools/merge.mjs` — `questions/raw/*.json` → `questions/mat.json` + `questions/sjl.json`.
- `tools/crop.mjs` — stránka PDF → orezaný PNG do `questions/assets/`. Orezáva
  headless Chromom, ktorý už v repe beží na `og.jpg`; súradnice dostane ako argumenty.
  **Bez tohto nástroja je MAT banka o ~23 % menšia** — sedem úloh na test je vyradených
  len pre chýbajúci obrázok (`questions/rejected.md`), a všetky sú označené ako
  vrátiteľné. Predpokladá nainštalovaný `pdftoppm`.

**Gate F2:**
- `node questions/check.js` prejde na pilotnej banke
- `node questions/check.js --daily` prejde: 400 dní, každý deň 3–7 úloh na predmet,
  žiadna jednotka dvakrát v jednom priechode
- validátor **padne** na zámerne poškodenej kópii (duplicitné `id`, `answer` mimo
  `options`, jednotka odkazujúca na neexistujúcu ukážku, téma mimo zoznamu) — bez
  tohto testu validátor nie je overený, len napísaný
- `node -e "require('./pick.js')"` funguje a `pick.js` neobsahuje kópiu zoznamu tém
  ani termínov (jediný zdroj je `questions/*.json` a `stops.js`)
- **`--streak` self-check prejde** na vymenovaných prípadoch séria dní
  (`01-ARCHITEKTURA.md`): víkend nepretrhne · zmeškaný pracovný deň s rezervou
  nepretrhne · bez rezervy vynuluje · rekord po vynulovaní zostáva · rezerva pribudne
  na 7., 14., 21. dni a nepresiahne 2 · **dnešný nedokončený deň sériu nepretrhne** ·
  prázdny vstup vráti nuly. Bez týchto assertov je séria najtichšia možná chyba
  v celej appke — nikto si nevšimne, že sa počíta o deň inak.

---

## F3 · Hromadné ťaženie

**Cieľ:** zvyšných šesť ročníkov v banke — 2017, 2018, 2019, 2022, 2023, 2025.
**12 testov** (2020 a 2021 sa nekonali, 2024 je pilot).

**Agenti:** 12 × sonnet, **paralelne, každý jeden test.** Prompt je
`.doc/prompt-tazenie.md` z F1, doplnený o cesty ku konkrétnym PDF.

**Poradie má význam:** najprv 2017, 2023 a 2025 — tie majú textovú vrstvu a idú cez
`pdftotext -layout` rovnako ako pilot. **2018, 2019 a 2022 sa dajú ťažiť až po
doinštalovaní poppleru** (`pdftoppm`), inak nemá agent ako stránku prečítať
(`.doc/zdroje.md`). Ak poppler nebude, banka má šesť ročníkov namiesto siedmich
a **musí to byť napísané**, nie mlčky vynechané.

Po každej dávke: `node tools/merge.mjs && node questions/check.js`.

**Gate F3 (na každý test samostatne):**
- `check.js` zelený
- **10 náhodných úloh** porovnaných s PDF opusom: zadanie, možnosti, odpoveď, téma,
  príslušnosť k ukážke
- **akákoľvek nesprávna `answer` = celý test sa ťaží znova** (`SendMessage` tomu
  istému agentovi so zoznamom chýb)
- vernosť zadania ≥ 9/10
- vyradených nie viac než 25 % úloh testu; nad tým sa pozerá, či agent nevyradzoval
  z pohodlnosti
- po zliatí: **≥ 120 úloh na predmet** (realistický výnos je ~150, viď
  `02-BANKA-OTAZOK.md`), `itemCount` súhlasí, banka ≤ 300 kB raw
- **kód testu kontrolovaný pri každom teste:** vzorka odpovedí musí sedieť so stĺpcom
  formy A, nie B. Toto je jediná chyba, ktorá prejde validátorom aj čítaním zadania

**Pozor na tichý strop:** ak sa niektorý rok nedá vyťažiť, **musí to byť napísané**
v `.doc/zdroje.md`, nie mlčky vynechané. Osem rokov, z ktorých šesť prešlo, je
osem rokov s dvoma dierami — nie „hotová banka".

---

## F4 · Dizajn (paralelne s F1–F3)

**Cieľ:** schválený komp a prepísané dizajnové pravidlá.

**Vlákno:** opus, skill `impeccable`. Vstup: `.doc/03-DIZAJN.md` ako direction
contract, `DESIGN.md` a `.impeccable/design.json` ako existujúci systém.

**Gate F4:**
- komp pre Dnes / Úloha / Výsledok / Výkaz **najprv na 375×667**, desktop až po ňom
  (mobile first, R9 — desktopový komp schválený pred mobilným je zamietnutý postup)
- tri prepísané pravidlá (One Signal, All-Caps Signage, No-Scroll) sú formulované,
  nie obídené
- rozhodnuté: jednotky rohového odpočtu a jeho pozícia na úzkom telefóne
- **na 375×667 sú na `#/uloha` zadanie a všetky možnosti viditeľné bez scrollovania**,
  keď je ukážka zbalená alebo žiadna nie je (`03-DIZAJN.md`). Toto je kritérium,
  na ktorom prvý komp F4 padol
- **kontrast dopočítaný, nie odhadnutý:** žiadny text na smaltovanej stene nie je
  `--ink-3` (3,38:1)
- žiadna nová farba ani nová alfa mimo existujúcej rampy — skontrolovať grepom
- **komp schvaľuje Robert.** Toto je jediný gate, ktorý neprechádza opus sám.

**Prompt do vlákna F4:**
> Prečítaj `.doc/00-KONTEXT.md` a `.doc/03-DIZAJN.md`, potom `DESIGN.md` a
> `.impeccable/design.json`. Spusti skill `impeccable` na návrh hlavnej plochy hry
> podľa direction contractu v `03-DIZAJN.md`. Svet je pevný (Pragotron tabuľa na
> smaltovanej stene), rozširuje sa, neprepisuje. Nepridávaj farbu ani alfa hodnotu
> mimo existujúcich tokenov. Výstupom je komp na 375×667 a desktope pre štyri pohľady,
> nové komponenty a roly do `design.json`, a prepísané tri pravidlá do `DESIGN.md`.

---

## F5 · Build v2.0 (bez backendu)

**Cieľ:** hrateľná appka na GitHub Pages, postup v `localStorage`.

**Delenie práce:**
- **opus:** `index.html` a `style.css` podľa schváleného kompu, rohová varianta
  odpočtu, zúženie interakcie v `main.js`. Toto je dizajnová práca, nie mechanická.
- **sonnet:** `store.js` (`localStorage` adaptér s rozhraním z `01-ARCHITEKTURA.md`),
  logika výsledkovej a výkazovej obrazovky nad hotovým `pick.js`.

**Gate F5 — kontroluje sa v tomto poradí, mobil prvý:**
- na **375×667** sa dá odohrať celý deň: 5 MAT + 5 SJL, výsledok, výkaz
- v `style.css` nie je ani jedna `@media (max-width: …)`, ktorá niečo odoberá —
  základ je telefón, desktop je `min-width` (R9)
- potvrdenie odpovede a prechod na ďalšiu úlohu sú v dolnej polovici obrazovky
- `100dvh`, `env(safe-area-inset-*)`, otestované aj v in-app prehliadači Messengeru
- `<meta name="robots" content="noindex">` je na stránke
- desktop sa kontroluje **až teraz**, ako rozšírenie
- **rohová tabuľa nezvoní pri tapnutí na odpoveď** (regresia z v1)
- postup prežije reload aj zatvorenie prehliadača
- séria, trieda spoja, rekord a **počet rezerv sú viditeľné** na výkaze; strata série
  nedramatizuje a rekord zostáva vedľa nuly (R10)
- deň sa započíta do série **len po dokončení oboch predmetov**
- `#/tabula` je v1 zážitok v plnej veľkosti vrátane stotín a kaskády
- `?og=1` renderuje tabuľovú plochu, nie hru
- `node send.js --test` stále zelený, `node questions/check.js` zelený
- `impeccable-finish-reviewer` prešiel, jeho nálezy vybavené
- klávesnica: `1`–`4`/`A`–`D` + `Enter` odohrajú celú úlohu
- `prefers-reduced-motion`: žiadny flip, stotiny zamrznuté
- veľkosť stránky bez banky ≤ 150 kB

---

## F6 · Firebase v2.1

**Cieľ:** účet, ktorý zálohuje postup. Bez osobných údajov.

**Ručné kroky (Robert, konzola):** nový projekt na Spark pláne, zapnuté Anonymous
Auth, Firestore v `europe-west3`, doména Pages v Authorized domains.

**Agent:** 1 × sonnet na `store.js` Firestore adaptér. **Bezpečnostné pravidlá píše
a kontroluje opus** — je to hranica dôvery, tam sa nešetrí.

**Gate F6:**
- pravidlá odmietnu čítanie aj zápis pod cudzím `uid` (overené v Rules Playground)
- **2 zápisy a 2 čítania na hráča a deň**, overené v konzole po dni používania
- lokálny postup sa pri vytvorení účtu **adoptuje**, nie prepíše
- appka funguje **aj keď Firebase zhorí** — offline, zablokovaný skript, prázdna
  odpoveď; v takom prípade tichý pád na `localStorage`
- Firebase SDK sa načíta až pri vytváraní účtu, nie pri otvorení stránky
- nikde v kóde ani v Firestore nie je e-mail, meno, vek, škola ani trieda
- UI pýta **prezývku**, nie meno, a text to hovorí nahlas

---

## F7 · OG, dokumentácia, uzavretie

**Cieľ:** náhľad predáva aj hru, koreňové dokumenty nie sú v rozpore s `.doc/`.

**Nesplatené z F5** (F5 do týchto súborov nesmelo písať):
- druhá veta do `og:description` o dennej päťke — `.github/og.mjs`
- `.answer-verdict` (stav vsadeného poľa krátkej odpovede) nie je v `DESIGN.md`
  ani v `design.json` — komp preň nemal stav, vznikol až v builde
- **puzdro herného obsahu** z F5b (vsadený panel, do ktorého sa presunul obsah
  `#/dnes`, `#/vysledok` a `#/vykaz`) tiež nie je v `DESIGN.md` ani `design.json`.
  Systém má po F5b kontejner, ktorý dokument neopisuje — `impeccable-documenter`
  ho má odvodiť z hotového artefaktu, nie z komppu
- `Store.saveDrill` — drill zo slabej linky sa neráta do štatistiky ani série
  (`ponytail:` v `quiz.js`, cesta je F6)

**Práce:** druhá veta do `og:description` v `.github/og.mjs`; prekreslenie `og.jpg`
(urobí `og.yml` sám); prepis `PRODUCT.md` (Product Purpose, Positioning), `CLAUDE.md`
(stack, nové súbory, nové rozhodnutia), `DESIGN.md` (už z F4); `README.md` o
`check.js` a `merge.mjs`.

**Gate F7:**
- Facebook Sharing Debugger aj skutočná správa v Messengeri zobrazia správny titulok
  a obrázok
- `og:title` je stále odpočet
- v `PRODUCT.md`, `CLAUDE.md`, `DESIGN.md` nezostala veta, ktorá protirečí `.doc/`
  (sekcia „Čo v2 láme na v1 pravdách" v `00-KONTEXT.md` je kontrolný zoznam)
- `<meta name="robots" content="noindex">` je na stránke a `source` s odkazom na
  originálne PDF je viditeľný u každej úlohy (`00-KONTEXT.md`, Autorské právo)

---

## Stav

| Fáza | Stav | Vlákno |
|---|---|---|
| F0a zdroje | **hotové** — `.doc/zdroje.md`, 7 ročníkov | 1.9.2026 |
| F0b stiahnutie PDF | **hotové** — 28 PDF v `source/`, gitignored | 1.9.2026 |
| F1 pilot (2024) | **hotové** — MAT 23/30, SJL 30/30, 53 odpovedí bez nezhody | 1.9.2026 |
| F2 validátor + nástroje | **hotové** — `pick.js`, `check.js`, `merge.mjs`, `crop.mjs` | 1.9.2026 |
| F3 hromadné ťaženie | čaká | |
| F3b rozšírenie 2010–2016 | **nepotrebné, ak bude poppler** — viď nižšie | |
| F4 dizajn | **hotové a komp schválený** — 2. kolo, oba nálezy opravené | 1.9.2026 |
| F5 build v2.0 | **hotové** — 5 pohľadov, 131 kB, gate zelený | 2.9.2026 |
| F5b revízia dizajnu | **hotové** — herný obsah do vsadeného panelu, šev steny odstránený | 2.9.2026 |
| F6 Firebase | čaká | |
| F7 OG + docs | čaká | |

### F3b nie je rozhodnutie o rokoch, je to rozhodnutie o binárke

Výnos z pilotu: MAT **77 %** použiteľných úloh (7 z 30 vyradených len pre obrázok),
SJL **100 %**. Z toho vychádza:

| stav | MAT | SJL | priechod |
|---|---|---|---|
| bez poppleru — 4 ročníky s textovou vrstvou | ~84 | ~120 | 21 dní |
| **s popplerom** — 7 ročníkov | ~153 | ~210 | 38 dní |
| s popplerom + `crop.mjs` — obrázkové úlohy vrátené | ~190 | ~210 | 45 dní |

Gate F3 žiada ≥ 120 úloh na predmet a **MAT bez poppleru skončí na ~84.** Poppler
prináša tri ročníky navyše a k tomu sedem vrátiteľných úloh na každý MAT test.
Ak sa doinštaluje, **F3b (2010–2016) netreba.** Ak nie, F3b je jediná cesta k číslu
120 a naráža na iné kurikulum starších Monitorov.

Tabuľku aktualizuje vlákno, ktoré fázu dokončí. Ak sa niečo rozhodne inak než je
v `.doc/`, prepíše sa **dokument, nie len kód** — inak sa ďalšie vlákno riadi
zastaranou pravdou.
