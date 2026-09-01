# 02 · Banka otázok — z PDF do JSON

Najdrahšia a najrizikovejšia časť v2. Nie technicky — obsahovo. Zlá otázka v banke je
horšia než chýbajúca: Paulinka sa naučí nesprávnu odpoveď a my o tom nevieme.

## Právny stav — rozhodnuté, ideme

Rozhodnutie je v `00-KONTEXT.md`, sekcia „Autorské právo": **projekt ide bez žiadosti
o súhlas.** Táto sekcia zostáva ako podklad, nie ako brzda — ak sa appka raz rozšíri
za pár spolužiakov, je tu všetko, čo treba na žiadosť, a nikto to nebude dohľadávať
odznova.

Na každej ročnej stránke archívu stojí: *„Na zverejnené testy a nahrávky k nim sa
vzťahuje autorské právo."* Odkazované *Vyhlásenie o autorstve*
(`www2.nucem.sk/dl/5342/`) dáva jednu výnimku, doslovne:

> „Písomný súhlas NIVAM nie je potrebný v prípade rozmnoženia a používania testov
> externej časti maturitnej skúšky, Testovania 9 a Testovania 5 (…), a to iba tých,
> ktoré sú zverejnené na webovom sídle NIVAM, **pre didaktické nekomerčné účely
> na školách**."

Naše použitie je nekomerčné a didaktické, ale **verejný web nie je „na školách"**.
Zverejnenie zadaní na GitHub Pages je rozmnoženie a šírenie mimo výnimky.

Platné pracovné pravidlá:

- **`source` je povinné pole každej úlohy** — rok, predmet, forma, číslo — a v appke
  je viditeľný odkaz na originálne PDF na `www2.nucem.sk`. Nie ako právna poistka,
  ale preto, že je to lepší produkt: kto chce vidieť celý test, klikne.
- **`<meta name="robots" content="noindex">`** na stránke. Držíme predpoklad, na
  ktorom rozhodnutie stojí — že sa k tomu nedostane nikto navyše. Cez Google by sa
  dostal.
- **Žiadosť na NIVAM je pripravená možnosť, nie gate.** Podklad: URL projektu,
  nekomerčnosť, bez reklám, bez registrácie e-mailom, NIVAM uvedený ako autor testov,
  odkaz na originál u každej úlohy.
- **Fallback, ak by raz bolo treba: vlastné zadania podľa vzoru.** Úloha sa prepíše
  vlastnými slovami a vlastnými číslami, štruktúra a téma zostanú. Legálne čisté, ale
  drahé a už to nie sú „historické testy". Nerobiť preventívne.

## Zdroje

Archív žije na **`www2.nucem.sk`** (prevádzkuje NIVAM, nástupca NÚCEM). `nivam.sk`
je len rozcestník.

- Prehľad: `https://www2.nucem.sk/sk/merania/narodne-merania/testovanie-9`
- Ročník: `https://www2.nucem.sk/sk/merania/narodne-merania/testovanie-9/roky/RRRR-RRRR`

Ročné podstránky existujú od `2004-2005` (vtedy *Monitor 9*) po súčasnosť, reálne
dostupný archív je **~2005–2025**. Kľúče správnych odpovedí sú u novších rokov
samostatné PDF, u starších niekedy len správa o výsledkoch.

Overené vzorky (zvyšok rokov nebol prechádzaný po jednom):

| Rok | Predmet | Test | Kľúč |
|---|---|---|---|
| 2024 | MAT | `/dl/5874/ZAK23008_S_TZ-RT-Mat-SJ-fA_1000.pdf` | `/dl/5887/…matematika.pdf` |
| 2024 | SJL | `/dl/5875/ZAK23008_S_TZ-RT-SJL-fA_2020.pdf` | `/dl/5885/…slovenský jazyk a literatúra.pdf` |
| 2018 | MAT | `/dl/825/ZAK17019_S_CTZ-RT-Mat-SJ-fA_1405.pdf` | `/dl/804/kluc_MAT_RT_2018.pdf` |
| 2018 | SJL | `/dl/827/ZAK17019_S_CTZ-RT-SJL-fA_2730.pdf` | `/dl/807/Kľúč_správnych_odpovedí_SJL-2018_RT.pdf` |

Dve zistenia, ktoré určujú pipeline:

- **PDF majú textovú vrstvu, nie sú to skeny.** Overené priamym čítaním testu MAT 2024:
  čitateľné zadania všetkých 30 úloh vrátane tabuliek a popiskov grafov. (Automatické
  fetchovanie webu tvrdilo opak — bol to artefakt toho nástroja.)
- **URL sa nedá odvodiť.** Vzor je `/dl/<id>/<názov>.pdf`, kde `<id>` je databázové
  číslo bez väzby na rok či predmet. Zoznam sa musí vyzbierať z ročných stránok, nie
  vygenerovať. `tools/fetch.mjs` teda dostane **ručne doplnený zoznam URL**, nie vzor.

**Neoficiálny mirror `monitor9.zones.sk/testy-testovanie9/`** má plynulejšie pokrytie
(~2008–2026) vrátane kľúčov a sám sa označuje ako zverejnený so súhlasom NÚCEM — to
tvrdenie je **neoverené a nespoliehame sa naň**. Použiteľný na doplnenie chýbajúceho
ročníka, ale zdrojom pravdy zostáva `www2.nucem.sk`.

### Ktoré roky brať a v akom poradí

Najprv **2017–2025**, potom smerom dozadu. Nie preto, že staršie sa nedajú prečítať,
ale preto, že staršie Monitory sedia na inom kurikule a inej formulačnej konvencii.
Osem posledných rokov × 2 predmety × ~30 úloh ≈ **480 úloh**, čo je pri 4 úlohách
denne **120 dní bez zopakovania na predmet**. To je viac než dosť do marca 2027;
ďalšie roky sú rozšírenie, nie podmienka spustenia.

## Ťaženie: agent čítajúci PDF, nie parser

Klasická cesta (`pdftotext -layout` + regulárne výrazy + heuristiky na rozdelenie
úloh) je tu **horšia voľba**. Rozdelenie testu na úlohy nie je formátovací problém,
je to problém porozumenia: ukážka platí pre úlohy 12–16, veľký príklad má vlastné
zadanie a pod ním päť otázok, niektoré úlohy majú možnosti A–D, iné krátku odpoveď.
Heuristika na to bude mať 200 riadkov a stále sa mýliť na každom druhom ročníku.

**Preto: jeden agent na jeden test.** Agent prečíta test PDF aj kľúč PDF priamo
(nástroj `Read` čita PDF po stránkach) a vydá jeden JSON súbor podľa schémy nižšie.
Modely nižšej triedy (sonnet) na to stačia, kontrola je v `check.js` + vzorkovanie
opusom (`04-PLAN.md`, gate F3).

`ponytail: žiadny PDF parser, žiadna závislosť. Ak by sa raz spracovávalo 200 testov
mesačne, vtedy má zmysel písať parser — pri 40 testoch raz je agent lacnejší.`

Jediná mechanická časť sú obrázky, viď „Obrázky" nižšie.

## Schéma banky

Jeden súbor na predmet: `questions/mat.json`, `questions/sjl.json`.

```json
{
  "subject": "mat",
  "version": 1,
  "generated": "2026-09-15",
  "itemCount": 471,
  "sources": [
    { "year": 2024, "form": "A", "test": "https://www2.nucem.sk/dl/5874/...", "key": "https://www2.nucem.sk/dl/5887/..." }
  ],
  "stimuli": {
    "mat-2024-a-s3": {
      "kind": "text",
      "title": "Cestovný lístok",
      "body": "Text ukážky, prípadne HTML tabuľka.",
      "asset": null
    }
  },
  "units": [
    { "stimulus": null, "ids": ["mat-2024-a-01"] },
    { "stimulus": "mat-2024-a-s3", "ids": ["mat-2024-a-12", "mat-2024-a-13", "mat-2024-a-14"] }
  ],
  "items": {
    "mat-2024-a-01": {
      "n": 1,
      "topic": "zlomky-desatinne",
      "text": "Zadanie úlohy tak, ako je v teste.",
      "asset": null,
      "type": "mc",
      "options": ["A možnosť", "B možnosť", "C možnosť", "D možnosť"],
      "answer": "C",
      "accept": [],
      "source": { "year": 2024, "form": "A", "n": 1 }
    }
  }
}
```

Pravidlá schémy:

- `id` = `<subject>-<rok>-<forma>-<NN>`, forma malým písmenom, číslo dvojmiestne.
  Ukážka má `-sN` namiesto čísla úlohy. Id je stabilné navždy — `review` v účte sa
  na ne odkazuje. **Id sa nikdy nemení a nerecykluje.**
- `units` je **jediný vstup pre výber dennej päťky.** Každé `id` z `items` musí byť
  v presne jednej jednotke. Samostatná úloha = jednotka s jedným id a `stimulus: null`.
- Skupina nad 7 úloh sa rozdelí na dve jednotky s tým istým `stimulus` — inak by
  jeden deň zjedol celú kapitolu.
- `type`:
  - `mc` — výber z možností, `answer` je `"A"`–`"E"`, `options` má rovnaký počet.
  - `num` — číselná odpoveď, `answer` je kanonický zápis, `accept` ďalšie prijímané.
  - `word` — jednoslovná alebo krátka textová odpoveď, rovnako `answer` + `accept`.
- `asset` je cesta do `questions/assets/` alebo `null`. Ak je uvedená a súbor
  neexistuje, `check.js` úlohu **vylúči z banky a nahlási** — nezlomí build.
- `topic` musí byť z uzavretého zoznamu nižšie. Nová téma = zmena zoznamu, nie
  vynález agenta.
- `source` je povinný u každej úlohy. Bez neho sa úloha nedá dohľadať v originále.

## Uzavretý zoznam tém

Zafixovaný **pred** hromadným ťažením. Bez neho vznikne 200 rôznych nálepiek a
štatistika slabých miest bude nečitateľná.

**Matematika (13)**
`zlomky-desatinne` · `percenta-pomer` · `mocniny-odmocniny` · `vyrazy-rovnice` ·
`slovne-ulohy` · `umernost-trojclenka` · `rovinne-obrazce` · `telesa` ·
`uhly-konstrukcie` · `pytagorova-veta` · `funkcie-grafy` ·
`statistika-pravdepodobnost` · `kombinatorika-logika`

**Slovenský jazyk a literatúra (11)**
`pravopis` · `hlaskoslovie` · `tvaroslovie` · `slovna-zasoba` · `skladba` ·
`sloh-postupy` · `literarna-teoria` · `poetika` · `porozumenie-textu` ·
`autori-diela` · `komunikacia`

Ak úloha sedí na dve témy, berie sa tá, ktorú testuje **rozhodnutie o správnej
odpovedi**, nie tá, ktorá je v texte spomenutá.

## Čo do banky nevstúpi

Podľa R7 v `00-KONTEXT.md` len strojovo overiteľné úlohy. Vylúčené a **zapísané
do `questions/rejected.md`** s dôvodom:

- „Narysuj", „zostroj", „doplň do obrázka" — odpoveď je výkres.
- „Vysvetli", „zdôvodni", „napíš krátku úvahu" — odpoveď je text na hodnotenie.
- Úloha, ktorej kľúč pripúšťa viac správnych postupov bez uzavretého zoznamu odpovedí.
- Úloha, ktorej zadanie sa bez obrázka nedá pochopiť a obrázok nemáme.
- Úloha odkazujúca na nahrávku (počúvanie s porozumením).

Log nie je administratíva: pri druhom prechode sa z neho dá vybrať, čo doplniť.

## Normalizácia odpovedí

Runtime porovnáva reťazce, nie významy. **Semantiku nikdy neháda** — čo je prijateľné,
je vypísané v `accept` už pri ťažení.

Normalizácia pred porovnaním (`num` a `word`):
1. `trim`, zbaliť viacnásobné medzery, odstrániť NBSP a medzery vnútri čísel
   („1 250" → „1250").
2. Desatinná čiarka → bodka („12,5" → „12.5").
3. Zjednotiť mínus a spojovníky na ASCII `-`.
4. `toLowerCase()`.

Čo sa **nerobí**:
- **Diakritika sa nikdy neodstraňuje.** V SJL je pravopis predmetom testu; prijať
  „hlaskoslovie" ako správne by bolo klamstvo.
- Jednotky sa nedopĺňajú ani neodstraňujú. Ak kľúč hovorí „12 cm", `answer` je `"12"`
  a jednotka je súčasťou zadania („Výsledok napíš v cm"), alebo je `"12 cm"` v `accept`.
- Zlomok a desatinné číslo nie sú automaticky ekvivalentné. Ak kľúč pripúšťa oboje,
  sú oboje v `accept`.

## Obrázky

Väčšina „obrázkov" v T9 sú tabuľky a grafy s číslami. Poradie krokov:

1. **Prepísať do textu.** Tabuľka → HTML `<table>` v `stimulus.body`
   (`kind: "table"`). Graf, z ktorého sa čítajú hodnoty → tabuľka hodnôt. Toto pokryje
   väčšinu a je to lepšie než obrázok: čitateľné, responzívne, prístupné.
2. **Skutočný obrázok** (geometrická konštrukcia, mapa, schéma) → PNG do
   `questions/assets/<id>.png`.
3. Ak ani jedno, úloha ide do `rejected.md`.

Rendrovanie: `pdftoppm -r 150 -png -f <str> -l <str>` dá stránku, `tools/crop.mjs`
ju oreže **headless Chromom, ktorý už v repe používame na `og.jpg`** — otvorí stránku
s obrázkom posunutým pod `--window-size` a urobí screenshot. Žiadna nová závislosť,
žiadny ImageMagick.

`ponytail: crop cez headless Chrome, lebo tam už je. Súradnice orezu zapisuje človek
alebo agent, ktorý stránku vidí — automatická detekcia rámca obrázka nie.`

## Validátor `questions/check.js`

Beží v čistom Node, bez závislostí, spúšťa sa ručne aj v CI. Padne (exit 1) na:

- neplatný JSON, chýbajúce povinné polia
- duplicitné `id`; `id` nezodpovedajúce vzoru `<subject>-<rok>-<forma>-<NN|sNN>`
- `id` v `items`, ktoré nie je v žiadnej jednotke, alebo je vo dvoch
- `unit.stimulus`, ktoré neexistuje v `stimuli`
- `type: "mc"` s `answer` mimo rozsahu `options`, alebo s menej než 3 možnosťami
- `type: "num"`/`"word"` s prázdnym `answer`
- `answer`, ktorý po normalizácii nesedí sám so sebou (chyba v `accept`)
- `topic` mimo uzavretého zoznamu
- chýbajúci `source`
- jednotku s viac než 7 úlohami
- `itemCount` nesúhlasiaci s počtom položiek

Varuje (exit 0, ale nahlási): chýbajúci súbor obrázka, úloha kratšia než 15 znakov,
možnosti s duplicitným textom, `subject` bez aspoň 40 úloh.

Súčasťou `check.js` je aj **self-check výberu dennej päťky** (`--daily`): pre 400 dní
dopredu overí, že žiadna jednotka nevypadne dvakrát v tom istom priechode a že každý
deň má 3–7 úloh na predmet. To je jediný test, ktorý netriviálnu logiku z
`01-ARCHITEKTURA.md` drží.

## QA — kontrola opusom

Automatický validátor overí formu, nie pravdu. Obsah kontroluje opus vzorkovaním:

- z každého vyťaženého testu **10 náhodných úloh**, porovnané s originálnym PDF:
  zadanie slovo za slovom, možnosti, správna odpoveď proti kľúču, téma, príslušnosť
  k ukážke
- **akákoľvek nesprávna `answer` = celý súbor sa zamieta** a ťaží znova. Nesprávna
  odpoveď je presne ten typ chyby, ktorý nikto nikdy nenájde a Paulinka sa ju naučí.
- odchýlka v texte (preklep, zle prepísaná tabuľka) = opraviť adresne, súbor prejde
- prijímací limit: 10/10 správnych odpovedí, ≥9/10 vernosti zadania

Pilotný test (F1) sa kontroluje **celý, nie vzorkou** — na ňom sa kalibruje prompt
pre zvyšok.
