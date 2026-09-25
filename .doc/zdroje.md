# Zdroje — PDF testov Testovania 9 a kľúčov, 2017–2025

Výstup fázy F0 (`.doc/04-PLAN.md`). Zlité z troch samostatných zberov
(2017–2019, 2020–2022, 2023–2025), tie sú po zliatí zmazané. **Toto je jediný
zdroj pravdy o tom, odkiaľ sa banka otázok ťaží.**

URL sa nedá odvodiť z roku ani predmetu (`02-BANKA-OTAZOK.md`) — každá tu uvedená
bola reálne nájdená v `href` na ročnej stránke
`https://www2.nucem.sk/sk/merania/narodne-merania/testovanie-9/roky/RRRR-RRRR`
a overená stiahnutím (HTTP 200, `%PDF` v hlavičke súboru).

Stĺpec `súbor` je názov v `source/` bez prípony: test je `<súbor>-test.pdf`,
kľúč `<súbor>-kluc.pdf`. `source/` je v `.gitignore`, PDF v repe nie sú.

## Kompletné dvojice test + kľúč

| rok | predmet | forma | súbor | URL testu | URL kľúča |
|---|---|---|---|---|---|
| 2017 | MAT | A | `mat-2017-a` | https://www2.nucem.sk/dl/830/T9_2017_Test_z_matematiky_v_slovenskom_jazyku.pdf | https://www2.nucem.sk/dl/834/Klu%C4%8D_spr%C3%A1vnych_odpovedi_MAT_2017_RT.pdf |
| 2017 | SJL | A | `sjl-2017-a` | https://www2.nucem.sk/dl/832/T9_2017_Test_zo_slovenskeho_jazyka_a_literatury.pdf | https://www2.nucem.sk/dl/841/K%C4%BE%C3%BA%C4%8D_spr%C3%A1vnych_odpoved%C3%AD_SJL_2017_RT.pdf |
| 2018 | MAT | A | `mat-2018-a` | https://www2.nucem.sk/dl/825/ZAK17019_S_CTZ-RT-Mat-SJ-fA_1405.pdf | https://www2.nucem.sk/dl/804/kluc_MAT_RT_2018.pdf |
| 2018 | SJL | A | `sjl-2018-a` | https://www2.nucem.sk/dl/827/ZAK17019_S_CTZ-RT-SJL-fA_2730.pdf | https://www2.nucem.sk/dl/807/K%C4%BE%C3%BA%C4%8D_spr%C3%A1vnych_odpoved%C3%AD_SJL-2018_RT.pdf |
| 2019 | MAT | A | `mat-2019-a` | https://www2.nucem.sk/dl/4348/TEST_T9_2019_MAT_sj_1100.pdf | https://www2.nucem.sk/dl/4363/T9-2019_K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20z%20MAT_AB.pdf |
| 2019 | SJL | A | `sjl-2019-a` | https://www2.nucem.sk/dl/4349/TEST_T9_2019_SJL_2331.pdf | https://www2.nucem.sk/dl/4367/T9-2019_K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20zo%20SJL_AB.pdf |
| 2022 | MAT | A | `mat-2022-a` | https://www2.nucem.sk/dl/5224/ZAK20035_S_CTZ-RT-Mat-SJ-fA_1077.pdf | https://www2.nucem.sk/dl/5258/T9-2022_Kľúč%20správnych%20odpovedí%20z%20MAT_AB.pdf |
| 2022 | SJL | A | `sjl-2022-a` | https://www2.nucem.sk/dl/5226/ZAK20035_S_CTZ-RT-SJL-fA_2699.pdf | https://www2.nucem.sk/dl/5259/T9-2022_Kľúč%20správnych%20odpovedí%20zo%20SJL_AB.pdf |
| 2023 | MAT | A | `mat-2023-a` | https://www2.nucem.sk/dl/5554/RT-Mat-SJ-fA_1022.pdf | https://www2.nucem.sk/dl/5572/K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20k%20testu%20T9%202023%20-%20matematika.pdf |
| 2023 | SJL | A | `sjl-2023-a` | https://www2.nucem.sk/dl/5552/RT-SJL-fA_2111.pdf | https://www2.nucem.sk/dl/5574/K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20k%20testu%20T9%202023%20%E2%80%93%20slovensk%C3%BD%20jazyk%20a%20literat%C3%BAra.pdf |
| 2024 | MAT | A | `mat-2024-a` | https://www2.nucem.sk/dl/5874/ZAK23008_S_TZ-RT-Mat-SJ-fA_1000.pdf | https://www2.nucem.sk/dl/5887/K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20k%20testu%20T9%202024%20-%20matematika.pdf |
| 2024 | SJL | A | `sjl-2024-a` | https://www2.nucem.sk/dl/5875/ZAK23008_S_TZ-RT-SJL-fA_2020.pdf | https://www2.nucem.sk/dl/5885/K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20k%20testu%20T9%202024%20%E2%80%93%20slovensk%C3%BD%20jazyk%20a%20literat%C3%BAra.pdf |
| 2025 | MAT | A | `mat-2025-a` | https://www2.nucem.sk/dl/6179/ZAK24004_S_TZ-RT-Mat-SJ-fA_3311.pdf | https://www2.nucem.sk/dl/6195/K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20k%20testu%20T9%202025%20%E2%80%93%20matematika.pdf |
| 2025 | SJL | A | `sjl-2025-a` | https://www2.nucem.sk/dl/6181/ZAK24004_S_TZ-RT-SJL-fA_1005.pdf | https://www2.nucem.sk/dl/6196/K%C4%BE%C3%BA%C4%8D%20spr%C3%A1vnych%20odpoved%C3%AD%20k%20testu%20T9%202025%20%E2%80%93%20slovensk%C3%BD%20jazyk%20a%20literat%C3%BAra.pdf |

**14 riadkov = 7 rokov × 2 predmety.** Každý má test aj kľúč.

## Diery — čo v rozsahu 2017–2025 nie je

| rok | predmet | čo chýba | prečo |
|---|---|---|---|
| 2020 | MAT + SJL | test aj kľúč | **T9 2020 zrušené** kvôli COVID-19. Na ročnej stránke je to explicitne napísané; zverejnené sú len špecifikácie testu (formát, nie zadania). Testovanie sa nekonalo, zadania teda neexistujú. |
| 2021 | MAT + SJL | test aj kľúč | **T9 2021 zrušené** rozhodnutím ministra školstva z 15. 1. 2021 (odkaz na rozhodnutie je na stránke). Namiesto celoslovenského testovania bežal len „Monitoring 9" na vzorke — z neho sú zverejnené len zistenia, nie test ani kľúč. Na stránke sú opäť len špecifikácie. |
| všetky | MAT + SJL | **forma B**, test aj kľúč | Na žiadnej z deviatich ročných stránok nie je forma B zverejnená. Overené nezávisle všetkými troma zbermi (`grep` na `href` aj na dátový blob v HTML: `-fB` ani „forma B" sa nevyskytuje). Nie je to diera v zbere — forma B na webe nie je. |

Rozsah teda nie je 9 rokov, ale **7 použiteľných ročníkov** (2017, 2018, 2019, 2022,
2023, 2024, 2025). **Skutočný výnos po F3 (25.9.2026):** MAT 168 úloh, SJL 200 úloh
(spolu 368; `questions/rejected.md` má presné počty a dôvody na test) — vyšlo lepšie
než pôvodný odhad ~150/predmet, lebo poppler sa doinštaloval a väčšina obrázkových
úloh sa dala prepísať verne (zvyšné idú do `rejected.md`, výhradne dôvod `obrázok`).
**Priechod** (`check.js --daily`): MAT ~40 dní, SJL ~50 dní. Opakovanie po ~5–7
týždňoch je zámer; rozšírenie na 2010–2016 (F3b) sa vďaka poppleru nepotrebovalo.

## Textová vrstva — overené na všetkých 28 PDF

`pdftotext -enc UTF-8` (xpdf 4.06), počet znakov po odstránení bielych miest.
Merané na všetkých 28 stiahnutých súboroch, nie na vzorke:

| ročník | test | kľúč |
|---|---|---|
| 2017 MAT | 5 820 | 327 |
| 2017 SJL | 9 991 | 375 |
| 2018 MAT | **0** | 355 |
| 2018 SJL | **0** | 375 |
| 2019 MAT | **0** | 571 |
| 2019 SJL | **0** | 1 905 |
| 2022 MAT | **0** | 571 |
| 2022 SJL | **0** | 1 425 |
| 2023 MAT | 9 692 | 768 |
| 2023 SJL | 12 786 | 1 505 |
| 2024 MAT | 10 302 | 740 |
| 2024 SJL | 14 803 | 1 373 |
| 2025 MAT | 10 009 | 909 |
| 2025 SJL | 14 670 | 1 484 |

**Šesť testov textovú vrstvu nemá:** 2018 MAT, 2018 SJL, 2019 MAT, 2019 SJL,
2022 MAT, 2022 SJL. Nie sú to rastrové skeny — všetky testy T9 sú CorelDRAW exporty
(`/Producer: Corel PDF Engine`, `/Creator: CorelDRAW`) a v týchto šiestich bolo písmo
pri exporte prevedené na obrysové krivky. Pre `pdftotext` je to to isté ako sken:
nula znakov. CorelDRAW sám nie je príčina — 2017 aj 2024 sú tiež Corel a text majú.

**Všetkých 14 kľúčov textovú vrstvu má** a všetky sú strojovo čitateľné. Je to presne
ten súbor, kde na presnosti záleží najviac (`02-BANKA-OTAZOK.md`: jedna zlá `answer`
= celý súbor sa zamieta), takže kľúč sa dá krížovo kontrolovať textom aj tam, kde
zadanie treba čítať obrazom.

Tým sa spresňuje tvrdenie v `02-BANKA-OTAZOK.md`, že „PDF majú textovú vrstvu, nie sú
to skeny". Platí pre 2017 a 2023–2025, neplatí pre 2018, 2019 a 2022. Pôvodné overenie
bežalo cez nástroj `Read`, ktorý PDF číta ako obraz — ten prečíta aj obrysové krivky,
takže textovú vrstvu nepotvrdzuje ani nevyvracia.

### Kľúč má dva stĺpce — pozor pri ťažení

Overené čítaním `mat-2017-a-kluc` a `sjl-2024-a-kluc`: kľúč obsahuje **dva kódy testu
a dva stĺpce odpovedí**. `sjl-2024-a-kluc` má kódy `2020` a `8111`, `mat-2017-a-kluc`
kódy `2112` a `4770`. To vysvetľuje prívlastok `_AB` v názvoch kľúčov 2019 a 2022:
jeden kľúč pokrýva dve poradia úloh toho istého testu.

**Kód testu je na titulnej strane testu** („KÓD TESTU", napr. `2112` pre 2017 MAT,
`2020` pre 2024 SJL — v niektorých rokoch je aj vo filename). Ťažiaci agent musí
brať stĺpec zodpovedajúci kódu **svojho** testu; druhý stĺpec je iné poradie úloh
a odpovede v ňom nesedia. Toto je najpravdepodobnejší zdroj systematickej chyby
v celej banke.

### Formát testu nie je konštantný

`mat-2017-a-test` má **20 úloh** (10 s číselnou odpoveďou + 10 výber z A–D, 60 minút),
`mat-2024-a-test` má **30 úloh** (15 + 15, 90 minút). Odhad „~30 úloh na test" v
`02-BANKA-OTAZOK.md` teda pre starší ročník neplatí. Presné počty (F3, 25.9.2026):
2017 a 2018 mali 20, zvyšných päť ročníkov 30 — spolu 190 MAT + 200 SJL pred
vyradením, 368 po ňom (`.doc/04-PLAN.md`, sekcia F3b).

Prečo to nemení plán ťaženia: `02-BANKA-OTAZOK.md` už rozhodol, že sa neťaží
parserom, ale agentom čítajúcim PDF. Agent číta stránku ako obraz, takže obrysové
krivky mu nevadia. Ťaženie 2017–2022 bude len drahšie (žiadna textová skratka) a
`pdftotext` sa na tie roky nedá použiť ani na krížovú kontrolu zadaní.

## Prekážka pre F1 — v tomto prostredí nie je `pdftoppm`

Nástroj `Read` na PDF aj `pdftoppm -r 150 -png` z `02-BANKA-OTAZOK.md` (sekcia
Obrázky) potrebujú poppler. V `/mingw64/bin` je **iba `pdftotext.exe`**; `pdftoppm`,
`pdfimages`, `mutool`, `gs` ani `magick` na stroji nie sú. `Read` na PDF preto padá
s `pdftoppm is not installed`.

Dôsledok: **F1 sa nedá začať, kým sa poppler nedoinštaluje** — inak agenti nemajú
ako testy prečítať a `pdftotext` pokrýva len ročníky 2023–2025. Nie je to
rozhodnutie, len chýbajúci binárny súbor.

## Poznámky ku zdroju

- **Forma A pre všetky roky, s výhradou.** Explicitný marker `-fA` majú vo filename
  len roky 2018, 2022, 2023, 2024, 2025. Roky 2017 a 2019 majú na stránke presne
  jeden test na predmet bez akéhokoľvek marku formy. V tabuľke sú zjednotené na `A`,
  aby `id` úlohy (`<subject>-<rok>-<forma>-<NN>`, `02-BANKA-OTAZOK.md`) bolo
  uniformné — forma nie je rozlišovač, keď je zverejnená len jedna.
- **Kľúče rokov 2019 a 2022 majú v názve `_AB`**, hoci test je zverejnený jeden.
  Pravdepodobne jeden kľúč pokrýva dve poradia úloh toho istého testu; nepotvrdené.
  Pre ťaženie to nič nemení — kľúč sa páruje s testom, ktorý existuje.
- **Vynechané zámerne:** paralelné testy pre iný jazyk vyučovania — `Mat-MJ`
  (matematika po maďarsky), `MJL` (maďarský jazyk a literatúra), `SJSL` (slovenský
  jazyk a slovenská literatúra pre školy s maďarským vyučovacím jazykom), `UJL`.
  Podľa R1 v `00-KONTEXT.md` sú predmety `mat` a `sjl` v slovenskom vyučovacom
  jazyku, čo je vetva `Mat-SJ` / `SJL`.
- **Vynechané zámerne:** analýzy úloh po teste, správy o výsledkoch, špecifikácie
  testov, organizačné pokyny. Nie sú to zadania ani kľúče.
- Ročné stránky sú server-rendered Next.js — `curl` bez headless prehliadača stačí,
  odkazy sú priamo v HTML.
- URL sú zjednotené na `https://`. Časť odkazov je na stránke uvedená ako `http://`;
  https bolo overené stiahnutím všetkých 28 súborov.
- Kľúče 2022 majú v `href` nezakódovanú diakritiku (`Kľúč`). `curl` ich takto pošle
  surovo a server odpovie HTTP 400 — pred stiahnutím treba cestu percent-enkódovať
  (`encodeURI`). Ostatné roky sú zakódované už na stránke.
- `HEAD` na `www2.nucem.sk/dl/…` vracia HTTP 405. Overovať existenciu súboru sa dá
  len `GET`-om.
- **Neoficiálny mirror `monitor9.zones.sk`** nebol použitý a nie je potrebný —
  `www2.nucem.sk` pokrýva všetkých sedem existujúcich ročníkov.
