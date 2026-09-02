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

Zistenia z F0, ktoré určujú pipeline (plný zoznam a merania v `.doc/zdroje.md`):

- **URL sa nedá odvodiť.** Vzor je `/dl/<id>/<názov>.pdf`, kde `<id>` je databázové
  číslo bez väzby na rok či predmet. Zoznam je preto vyzbieraný ručne do
  `.doc/zdroje.md` a je to jediný zdroj pravdy o zdrojoch.
- **Textová vrstva je len v časti testov.** Overené `pdftotext` na všetkých 28 PDF:
  **2017 a 2023–2025 text majú, 2018, 2019 a 2022 nie** (v Corel exporte bolo písmo
  prevedené na obrysové krivky, pre `pdftotext` je to nula znakov). **Všetkých 14
  kľúčov text má** — a to je súbor, kde na presnosti záleží najviac.
- **Zverejnená je len forma A**, na žiadnej ročnej stránke nie je test formy B.
  Kľúč však obsahuje **obidva** stĺpce, viď pasca nižšie.
- **Počet úloh nie je konštantný.** 2024 MAT má 30 úloh (01–15 číselná odpoveď,
  16–30 výber z A–D, 90 minút), 2017 MAT má 20 úloh a 60 minút. Nepredpokladaj počet,
  prečítaj úvodnú stranu testu — je tam napísaný vetou.
- **`pdftoppm` na stroji nie je** (v `/mingw64/bin` je iba `pdftotext`), takže nástroj
  `Read` na PDF padá. Roky s textovou vrstvou sa ťažia cez `pdftotext -layout` a
  poppler treba doinštalovať až pre 2018, 2019, 2022 a pre orezávanie obrázkov.

### Pasca, ktorá by prešla celou bankou: KÓD TESTU

Kľúč má **dva stĺpce, Forma A a Forma B**, a sú to tie isté úlohy v inom poradí.
Príklad z `mat-2024-a-kluc`: hlavička `Forma A 1000/3122` a `Forma B 7677/7051`,
pričom odpoveď na úlohu 8 vo forme A (`11,9`) je odpoveďou na úlohu 1 vo forme B.

Titulná strana testu nesie **`TESTOVÁ FORMA`** a **`KÓD TESTU`** (2024 MAT: forma `A`,
kód `1000` — ten istý kód je aj v názve súboru `…-fA_1000.pdf`).

**Ťažiaci agent musí prečítať kód testu z titulnej strany a brať výhradne stĺpec, ktorý
mu zodpovedá.** Zámena stĺpcov nevyrobí ani jednu viditeľnú chybu — vyrobí test,
v ktorom je *každá* odpoveď posunutá, a validátor to nemá ako zistiť. Je to
najpravdepodobnejší zdroj systematickej chyby v celej banke.

**Neoficiálny mirror `monitor9.zones.sk/testy-testovanie9/`** má plynulejšie pokrytie
(~2008–2026) vrátane kľúčov a sám sa označuje ako zverejnený so súhlasom NÚCEM — to
tvrdenie je **neoverené a nespoliehame sa naň**. Použiteľný na doplnenie chýbajúceho
ročníka, ale zdrojom pravdy zostáva `www2.nucem.sk`.

### Ktoré roky brať a v akom poradí

**Sedem ročníkov: 2017, 2018, 2019, 2022, 2023, 2024, 2025.** T9 2020 a 2021 sa
nekonali (COVID), zadania neexistujú — nie je to diera v zbere.

Realistický výnos: 7 testov na predmet × 20–30 úloh ≈ **175 úloh**, po vyradení
neoveriteľných **~150 použiteľných na predmet**. Pri 4 nových úlohách denne to je
**priechod ~38 dní**, nie 120 — pôvodný odhad v tomto dokumente bol nadsadený a je
opravený. Do marca 2027 to znamená ~5 priechodov.

**Opakovanie po ~5 týždňoch je zámer, nie chyba.** Presne toľko trvá, kým človek
úlohu zabudne, a algoritmus poradie pri každom priechode premieša (`01-ARCHITEKTURA.md`).

Rozšírenie dozadu (2010–2016, ďalších ~7 ročníkov, priechod by narástol na ~75 dní)
je **voliteľná fáza F3b** — rozhoduje sa až po F1, keď bude známy skutočný výnos
z jedného testu. Staršie Monitory sedia na inom kurikule a inej formulačnej konvencii,
takže to nie je zadarmo.

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

### Štyri pravidlá z pilotu F1

Overené na ročníku 2024, platia pre všetkých 12 zvyšných testov.

**1. `pdftotext -layout` posúva telo tabuľky oproti menovkám riadkov.** V 2024 MAT sú
tak pokazené obe tabuľky: stĺpec „Voda" a „Minerálne látky" sedia na svojich riadkoch,
prostredné tri stĺpce vypadnú ako samostatné trojice pod tabuľkou. Tabuľku treba
**zrekonštruovať, nie vyradiť** — ale:

**2. Rekonštrukciu potvrdzuje zadanie úlohy a kľúč, nikdy číselný invariant.**
Pilot sa oprel o „zloženie na 100 g musí dať 100 g" — ten invariant **neplatí**
(riadky dali 99,8 / 100,0 / 100,5 / 100,5; tabuľky zloženia potravín sa na 100 g
nesčítavajú kvôli zaokrúhľovaniu). Priradenie bolo napriek tomu správne, lebo ho
nezávisle určujú tvrdenia v úlohe: T1 („500 g kozieho mlieka obsahuje 21 g tuku")
fixuje kozí tuk na 4,2, T2 fixuje ovčiu a kravskú bielkovinu, a kľúč potvrdí, ktoré
tvrdenie je pravdivé. Rovnako pri tancoch: úloha 15 (380 = 38 % z 1 000) fixuje tango,
štyri tvrdenia úlohy 16 sa dotknú každého riadka.

**Postup je teda:** zrekonštruuj priradenie, potom over, že **každé tvrdenie a každá
možnosť v úlohách nad tou ukážkou vychádza** a že kľúč sedí. Ak sa priradenie nedá
takto potvrdiť, úloha ide do `rejected.md` — nie do banky s odôvodnením „inak to
nemôže byť".

**3. Odkaz na médium musí sedieť s tým, čo banka naozaj zobrazuje.** Toto je jediná
výnimka z pravidla „zadanie prepisuj verne": ak dáta z obrázka skončili v texte
ukážky, veta „Pomocou rozmerov **uvedených na obrázku**" ukazuje na niečo, čo tam nie
je, a „na základe informácií **z diagramu**" nad HTML tabuľkou tiež. Prepíš **len ten
ukazovací zvrat** („pomocou uvedených rozmerov", „z tabuľky") a nič iné. Zvyšok
zadania zostáva slovo za slovom.

**4. Poznámka pod kľúčom sa musí prečítať.** Kľúč SJL 2024 má pod tabuľkou:
*„Odpovede na otvorené úlohy podľa formy 2020 č. 6, 7, 13, 20 môžu byť zapísané
v akomkoľvek gramatickom tvare."* Čísla úloh sú **per forma** — ďalšia inštancia pasce
KÓD TESTU. Pri úlohách typu „Vypíš z ukážky…" to nie je problém: prirodzená odpoveď je
tvar, ktorý v ukážke stojí, a ten patrí do `answer`. Pri dopĺňaní do vety patria do
`accept` všetky tvary, ktoré kľúč vypisuje za lomkou.

`ponytail: žiadne fuzzy porovnávanie a žiadne domýšľanie pádov. Ak sa pri hraní ukáže,
že to vadí, riešenie je doplniť accept u konkrétnej úlohy.`

### Prijatá strata vernosti: graf → tabuľka

Skladaný stĺpcový graf prepísaný do HTML tabuľky mení testovanú zručnosť: „prečítaj
hodnotu z grafu" sa stane „prečítaj hodnotu z tabuľky". Odpoveď zostáva tá istá,
náročnosť trochu klesne. Prijaté zámerne — alternatíva je obrázok, ktorý je na
telefóne nečitateľný a neprístupný. Neplatí to pre úlohy, kde je **grafom samotná
odpoveď** („ktorý zo štyroch diagramov zobrazuje správne rozdelenie") — tie idú
do `rejected.md`.

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
- **V `questions/raw/` zostáva skupina celá** — je to verná kópia testu, kde čítacia
  ukážka má naozaj sedem otázok. Rezanie na časti do 5 úloh robí `tools/merge.mjs`
  pri zlievaní servírovanej banky (7 → 4+3, tá istá ukážka). Validátor preto na
  `questions/*.json` padne pri jednotke nad **5** úloh, nie nad 7.
- **Dlhé zadanie ide do `stimuli`, ale len keď je to kontext.** Zistené v F5:
  `mat-2024-a-26` mal 367 znakov (recept na palacinky plus otázka na pomer) a na
  telefóne sa nezmestil. Recept je kontext, otázka je posledná veta — patrí to do
  `stimuli` + krátky `text`. **Neplatí to pre slovnú úlohu**, kde sú čísla v zadaní
  samotnou otázkou (`mat-2024-a-11`, dialóg o úsporách má 365 znakov a je to jedna
  nedeliteľná úloha) — tam by zbalená ukážka skryla to, čo treba počítať.
  Rozhodovacia otázka: **odkazuje otázka na ten text, alebo ten text JE otázka?**
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

**Matematika (14)**
`zlomky-desatinne` · `percenta-pomer` · `mocniny-odmocniny` · `vyrazy-rovnice` ·
`slovne-ulohy` · `umernost-trojclenka` · `rovinne-obrazce` · `telesa` ·
`uhly-konstrukcie` · `pytagorova-veta` · `funkcie-grafy` ·
`statistika-pravdepodobnost` · `kombinatorika-logika` · `jednotky-premeny`

**Slovenský jazyk a literatúra (11)**
`pravopis` · `hlaskoslovie` · `tvaroslovie` · `slovna-zasoba` · `skladba` ·
`sloh-postupy` · `literarna-teoria` · `poetika` · `porozumenie-textu` ·
`autori-diela` · `komunikacia`

Ak úloha sedí na dve témy, berie sa tá, ktorú testuje **rozhodnutie o správnej
odpovedi**, nie tá, ktorá je v texte spomenutá.

`jednotky-premeny` pribudlo po pilote F1: premena jednotiek obsahu a objemu je v T9
samostatná úloha (2024 MAT má dve) a žiadna z pôvodných trinástich tém ju nepokrýva.
Bez nej padala pod `zlomky-desatinne` a `telesa`, kde by v štatistike slabých miest
klamala.

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

Padne aj na týchto troch, ktoré vyplynuli z pilotu F1:

- **úloha typu „Vypíš z ukážky…"**, ktorej `answer` ani žiadny tvar z `accept`
  **nie je podreťazcom `stimulus.body`**. Odpoveď na opisovaciu úlohu musí byť
  v ukážke prítomná — inak je buď zlá, alebo je ukážka nekompletná. Toto je
  najlacnejší existujúci test vernosti ťaženia.
- **`type: "num"` s odpoveďou, ktorá po normalizácii nie je číslo**
- **jednotka so `stimulus`, ktorého `body` je prázdne**

Varuje (exit 0, ale nahlási): chýbajúci súbor obrázka, úloha kratšia než 15 znakov,
možnosti s duplicitným textom, `subject` bez aspoň 40 úloh, a **zadanie spomínajúce
„obrázok / obrázku / diagram", ktoré nemá `asset`** — buď chýba obrázok, alebo sa
zabudlo prepísať ukazovací zvrat (pravidlo 3 vyššie).

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
