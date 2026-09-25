# Prompt na ťaženie jedného testu — kalibrovaný pilotom F1

Výstup fázy F1. Tento súbor je **zdroj pravdy pre F3**: dvanásť agentov dostane
tento prompt, doplnený o cesty ku svojim PDF a o kontrolný bod zo svojho kľúča.

Kalibrované na pilote `mat-2024-a` a `sjl-2024-a`. Sekcia „Čo sa v pilote pokazilo"
na konci je dôvod, prečo je prompt takto dlhý — každý odsek je tam po konkrétnej
chybe, nie preventívne.

---

## Šablóna promptu

> Pracuješ v koreni repa (`/Users/robkrzn/Documents/Projekty/OdpocetSkola`, macOS).
> Ťažíš JEDEN test Testovania 9 do JSON banky otázok.
>
> ### Najprv prečítaj
> `.doc/02-BANKA-OTAZOK.md` — CELÝ. Hlavne sekcie „Pasca, ktorá by prešla celou
> bankou: KÓD TESTU", „Schéma banky", „Uzavretý zoznam tém", „Čo do banky nevstúpi",
> „Normalizácia odpovedí", „Obrázky".
>
> ### Tvoje vstupy
> - test: `source/<SUBOR>-test.pdf`
> - kľúč: `source/<SUBOR>-kluc.pdf`
>
> Primárne ich čítaj cez `pdftotext -layout -enc UTF-8 <súbor>.pdf -` v Bash tooli.
>
> **Poppler je nainštalovaný** (od 21. 9. 2026), takže stranu vieš aj vidieť:
>
> ```bash
> pdftoppm -r 150 -png -f <strana> -l <strana> source/<SUBOR>-test.pdf /tmp/<SUBOR>-s
> ```
>
> a výsledný PNG otvor nástrojom `Read`. Na PDF `Read` stále nepúšťaj, len na PNG.
>
> - **Ročníky 2018, 2019 a 2022 nemajú textovú vrstvu vôbec** (`.doc/zdroje.md`):
>   `pdftotext` na teste vráti prázdno. Taký test ťažíš **celý z vyrenderovaných
>   strán** — stranu po strane, `Read` na každú. Kľúč textovú vrstvu má vždy, ten
>   čítaj naďalej cez `pdftotext`. Neťaž test naslepo z kľúča.
> - Pri ročníkoch s textovou vrstvou je render **druhý názor, nie hlavný zdroj**:
>   vyrenderuj stranu vždy, keď si pri tabuľke, grafe alebo zalomenej vete nie si
>   istý, čo `-layout` vlastne vypísal. Je to lacnejšie než úlohu vyradiť.
>
> ### Tvoje výstupy — a nič iné
> 1. `questions/raw/<SUBJECT>-<ROK>-<FORMA>.json`
> 2. `questions/rejected-<SUBJECT>-<ROK>-<FORMA>.md` — **vlastný súbor**. Nikdy nepíš
>    do `questions/rejected.md`; paralelne bežia ďalší agenti a zlieva sa to centrálne.
>
> Žiadny iný súbor nemeň. Nekomituj, nespúšťaj git.
>
> ### KÓD TESTU — najdôležitejšia vec v celej úlohe
> Titulná strana testu nesie `TESTOVÁ FORMA` a `KÓD TESTU`. Prečítaj ich a napíš
> do reportu. Kľúč má **dva stĺpce** s dvoma kódmi — tie isté úlohy v inom poradí.
> Ber **výhradne stĺpec, ktorého kód sedí s kódom na titulke tvojho testu**.
> Zámena stĺpcov nevyrobí ani jednu viditeľnú chybu — vyrobí test, kde je *každá*
> odpoveď posunutá, a validátor to nemá ako zistiť.
>
> **Kontrolný bod:** v správnom stĺpci je odpoveď na úlohu `<N>` = `<HODNOTA>`.
> Ak ti tam vyšlo niečo iné, čítaš zlý stĺpec — zastav sa a začni znova.
>
> Ako čítať dvojstĺpcový kľúč z `-layout` výstupu:
> - Každý riadok obsahuje číslo úlohy **dvakrát** — raz pre ľavú formu, raz pre pravú.
>   Deliaci bod je druhý výskyt `<číslo>.`.
> - Písmeno odpovede je vizuálne odsadené pod hlavičkou A/B/C/D, ale **samotný znak
>   je vytlačený**. Ber znak, nikdy nie pozíciu — pozičný dekodér je zbytočný a krehký.
> - Dlhé slovné odpovede sa **zalamujú na ďalší riadok** (v pilote `svedkom*`
>   samostatne). Zlievaj ich ručne, nie regulárnym výrazom naslepo.
> - **Poznámky pod čiarou čítaj až na konci a aplikuj spätne** — menia `accept`
>   u konkrétnych čísel úloh, nie u celého kľúča.
>
> ### Rozsah testu
> Titulka hovorí **vetou**, koľko má test úloh a ako sú rozdelené („Test obsahuje 30
> testových úloh… V úlohách 01 – 15 zapíšte… V úlohách 16 – 30 vyberte…"). Prečítaj
> tú vetu a riaď sa ňou. **Nepredpokladaj počet ani rozdelenie** — 2024 MAT má 30
> úloh, 2017 MAT má 20. V SJL sa typy striedajú, nie sú v súvislých blokoch.
>
> ### Pravidlá ťaženia
> - **`id` = `<subject>-<rok>-<forma>-NN`**, forma malým písmenom, číslo dvojmiestne.
>   Ukážka má `-sN`. Id je stabilné navždy.
> - **Zadanie prepisuj verne.** Neskracuj, neprerozprávaj, nevynechaj vetu. Opravuj
>   len to, čo pokazil `pdftotext`: rozpadnuté riadky, zlé medzery, rozdelené slová.
>   Diakritiku zachovaj presne — v SJL je pravopis predmetom testu.
> - **Horné indexy z textovej vrstvy vypadnú.** `2 · 107` je v origináli 2 · 10⁷,
>   `m3` je m³, `dm2` je dm². Obnov ich ako Unicode a **rovnako v celom súbore** —
>   v pilote agent opravil dve úlohy a na piatich nechal `m2`.
> - **Správnu odpoveď ber VÝHRADNE z kľúča.** Nikdy neriešiť úlohu samostatne, nikdy
>   neopravovať kľúč. Ak sa ti zdá, že kľúč je zlý, použi kľúč a napíš to do reportu.
> - `type: "num"` → `answer` je zápis z kľúča vrátane desatinnej čiarky (`"14,4"`).
>   Runtime si čiarku aj medzery normalizuje, takže `accept` nechaj prázdne, ak kľúč
>   neuvádza inú alternatívu.
> - `type: "mc"` → `answer` je `"A"`–`"D"`, `options` sú štyri texty **v poradí A–D**,
>   bez písmen na začiatku (`"12 cm"`, nie `"A) 12 cm"`).
> - `type: "word"` → kľúč uvádza varianty lomkou (`fyziky/fyzika/Fyziky/Fyzika`).
>   `answer` = prvý variant; `accept` = tie, čo sa líšia **aj po `toLowerCase()`**
>   (teda `fyzika`, nie `Fyziky`). Diakritika sa neodstraňuje nikdy.
>   Ak poznámka kľúča pripúšťa ľubovoľné poradie slov, vypíš **všetky permutácie** —
>   je to uzavretý zoznam. Ak pripúšťa „akýkoľvek gramatický tvar", zapíš varianty
>   z kľúča a **nahlás to**; ďalšie pády si nevymýšľaj.
> - **`topic` z uzavretého zoznamu** v `02-BANKA-OTAZOK.md`. Ak úloha sedí na dve
>   témy, ber tú, ktorú testuje **rozhodnutie o správnej odpovedi**, nie tú, čo je
>   spomenutá v texte. Ak nesedí ani na jednu, **nahlás to** — zoznam sa mení
>   centrálne, ty ho nemeníš.
> - `source` je povinný: `{ "year": …, "form": "A", "n": <číslo úlohy> }`.
> - `asset` je vždy `null`. Poppler už na stroji je, ale orezávať a ukladať obrázok
>   ku každej úlohe je vlastná fáza (F3b, `tools/crop.mjs`) — teraz nie. Render
>   používaš na **čítanie**, nie na to, aby si vyrábal `asset`.
>
> ### Ukážky a jednotky
> - Test píše hranice **explicitne**: „Na ukážku 2 sa vzťahujú úlohy 08 – 14",
>   „Na zadanie Spoločenské tance sa vzťahujú úlohy 15 a 16". **Toto hľadaj ako prvý
>   krok** — je to spoľahlivejšie než odhadovať z obsahu.
> - Spoločný text/tabuľka → `stimuli` (`kind`, `title`, `body`, `asset: null`) a úlohy
>   zviazané jednou `unit`. Samostatná úloha = `unit` s jedným `id` a `stimulus: null`.
> - Jednotka má **najviac 7 úloh**; nad tým rozdeľ na dve s tým istým `stimulus`.
> - **Každé `id` z `items` musí byť v presne jednej `unit`.**
>
> ### Tabuľky a grafy — tu sa pilot potkol najviac, čítaj pomaly
> - Tabuľku prepíš ako HTML `<table>` do `stimulus.body`. Väčšina „obrázkov" v T9 sú
>   tabuľky a grafy s číslami; prepísané sú **lepšie** než obrázok.
> - **`pdftotext -layout` posúva telo tabuľky o riadok oproti menovkám.** Overené na
>   dvoch tabuľkách pilotu. Vyzerá to čitateľne a je to pasca: vznikne tabuľka, ktorá
>   je celá posunutá, a nič to nenahlási.
> - **Preto každú prepísanú tabuľku over invariantom, ktorý plynie zo samotných dát:**
>   riadky skladaného percentuálneho grafu musia dať 100 %; zloženie na 100 g musí dať
>   100 g; súčty a medzisúčty musia sedieť. Ak invariant nesedí, priradenie je zlé —
>   posuň blok o riadok a skús znova.
> - **Nikdy nedopočítavaj hodnoty spätne z kľúča.** Kľúč smie prípadné priradenie
>   *potvrdiť*, nikdy ho nesmie *určiť*. Ak invariant priradenie neurčí, **najprv
>   vyrenderuj tú stranu a pozri sa na ňu** — posun riadkov je artefakt `-layout`,
>   nie vlastnosť tabuľky. Do rejectu s dôvodom `obrázok` ide až to, čo nesedí ani
>   po pohľade na stranu.
> - **Neprepisuj graf výberom.** Ak z piatich riadkov diagramu vieš spoľahlivo len
>   jeden, nezapíš do `stimulus` iba ten jeden — je to nepravdivý prepis ukážky.
>   Buď dorob celú tabuľku cez invariant, alebo vyraď.
> - **Rozmery z obrázka neprelievaj do vety, ktorá stratí orientáciu.** „kváder
>   s rozmermi 120 × 100 × 100 cm" je pre úlohu na povrch nepoužiteľné — chýba, čo je
>   podstava a čo výška. Píš „s podstavou 120 cm × 100 cm a výškou 100 cm", alebo vyraď.
>
> ### Čo vyradiť
> Do `questions/rejected-<test>.md`, nie do JSON. Vyraď iba to, čo je **naozaj
> strojovo neoveriteľné**, nie to, čo je nepohodlné prepísať:
> - „Narysuj / zostroj / doplň do obrázka" — odpoveď je výkres.
> - „Vysvetli / zdôvodni / napíš úvahu" — odpoveď je text na hodnotenie.
> - Kľúč pripúšťa viac postupov bez uzavretého zoznamu odpovedí.
> - Úloha odkazujúca na nahrávku (počúvanie s porozumením).
> - **Úloha, ktorá sa bez obrázka nedá vyriešiť** — z textu nevyplývajú všetky čísla
>   a vzťahy. Sem patria aj úlohy, ktorých **možnosti A–D sú samotné obrázky**.
>   Dôvod píš `obrázok`, aby sa dalo spočítať, koľko sa vráti po `pdftoppm`.
>
> Formát: nadpis `## <subject>-<rok>-<forma>` a tabuľka
> `| id | dôvod (výkres / text / otvorený kľúč / nahrávka / obrázok) | jedna veta |`.
>
> ### Formát JSON
> Top-level presne takto, zvyšok podľa schémy v `02-BANKA-OTAZOK.md`:
> `{ "subject", "year", "form", "code", "source": { "test", "key" }, "stimuli",
> "units", "items" }`. URL vyzobni z tabuľky v `.doc/zdroje.md`.
> Odsadenie 2 medzery, UTF-8, LF konce riadkov.
> Over `node -e "JSON.parse(require('fs').readFileSync('<cesta>','utf8'))"`.
>
> ### Než skončíš — sám si skontroluj
> 1. Prejdi **všetky** odpovede ešte raz proti svojmu stĺpcu kľúča, položku po
>    položke. Nie vzorku.
> 2. Každá prepísaná tabuľka prešla invariantom.
> 3. Typy a počty sedia s vetou z titulky.
> 4. Počet `id` v `units` = počet kľúčov v `items`, žiadne dvakrát, žiadne chýbajúce.
> 5. Vyradené úlohy nie sú v `items` ani v `units`.
> 6. Horné indexy sú opravené v celom súbore, nie len na niektorých úlohách.
>
> ### Vráť (a NIČ z obsahu JSON)
> - `TESTOVÁ FORMA` a `KÓD TESTU` z titulky a ktorý stĺpec kľúča si použil
> - výsledok kontrolného bodu
> - počet úloh, ukážok, jednotiek, vyradených (z toho koľko s dôvodom `obrázok`)
> - ktoré tabuľky si prepísal a akým invariantom si ich overil
> - zoznam miest, kde si si nebol istý (číslo úlohy + jedna veta)

---

## Čo sa v pilote pokazilo

Poradie podľa toho, koľko škody by to narobilo v F3.

**1. Tichý posun tabuľky — najzávažnejšie, oba výskyty v jednom teste.**
`pdftotext -layout` vykreslil telo oboch tabuliek v `mat-2024-a` o riadok nižšie než
menovky riadkov. Agent to raz vyriešil tak, že zo skladaného grafu piatich tancov
zapísal do `stimulus` **len jeden riadok** (ten, ktorý vedel potvrdiť) a druhú úlohu
z tej istej ukážky vyradil; a raz tak, že celú tabuľku zloženia mlieka vyradil.
Obidve tabuľky sa pritom dajú zrekonštruovať **bez kľúča** — riadky skladaného grafu
musia dať 100 %, zloženie na 100 g musí dať 100 g. Priradenie vyšlo jednoznačne
a kľúč ho až potom nezávisle potvrdil, pri diagrame tancov na štyroch možnostiach
naraz. Obe úlohy sú teraz v banke.
→ v prompte: sekcia „Tabuľky a grafy", pravidlo invariantu, zákaz výberového prepisu.

**2. Rozmery z obrázka preliate do vety, ktorá stratí orientáciu.**
Agent napísal „nádoba v tvare kvádra s rozmermi 120 cm × 100 cm × 100 cm" a nechal
v banke úlohu na plochu plachty cez bočné steny a hornú podstavu. Z takej vety sa
nedá povedať, čo je podstava — vychádza aj 5,6 aj 5,8 m². Obrázok orientáciu určuje,
prepis ju zahodil. Opravené na „s podstavou 120 cm × 100 cm a výškou 100 cm".
→ v prompte: posledná odrážka sekcie o tabuľkách.

**3. Horné indexy opravené len miestami.** `10⁷` a `cm³` áno, `m2` a `dm2` na piatich
ďalších úlohách nie. Nie je to chyba porozumenia, je to chýbajúci posledný prechod.
→ v prompte: vlastná odrážka + bod 6 v self-checku.

**4. Uzavretý zoznam tém mal dieru.** Premena jednotiek obsahu a objemu je v 2024 MAT
samostatná úloha (dve), a nesedela na žiadnu z trinástich tém — padla pod
`zlomky-desatinne` a `telesa`. Doplnené `jednotky-premeny`, zoznam má 14 tém.
→ v prompte: „ak nesedí ani na jednu, nahlás to — zoznam sa mení centrálne".

**5. Jedna téma vecne mimo.** SJL úloha „Uveď vybrané slovo, ktorého význam
charakterizuje počasie" dostala `poetika`, hoci o poetike nie je nič — rozhoduje
znalosť vybraných slov, teda `pravopis`. Opravené adresne.
→ v prompte: dôraz na „tému určuje rozhodnutie o správnej odpovedi".

**6. Varovanie o pozičnom čítaní kľúča bolo prehnané.** `02-BANKA-OTAZOK.md` varuje,
že písmeno odpovede je odsadené podľa stĺpca A/B/C/D. V oboch kľúčoch pilotu je znak
vytlačený a pozičná logika nie je potrebná ani žiaduca. Prompt to teraz hovorí rovno,
aby agent nestaval krehký dekodér.

**Čo fungovalo a netreba to meniť:** kontrolný bod v prompte (obaja agenti ho použili
a obaja vzali správny stĺpec — nula posunutých odpovedí zo 60); požiadavka prejsť
všetky odpovede, nie vzorku; oddelený reject súbor na agenta; explicitné vety
„Na ukážku N sa vzťahujú úlohy A–B" ako prvý krok pri delení na jednotky.

## Známe zúženie oproti papierovému hodnoteniu

Kľúč SJL 2024 má poznámku, že odpovede na otvorené úlohy 6, 7, 13 a 20 „môžu byť
zapísané v akomkoľvek gramatickom tvare, ale musia byť pravopisne správne". To je
otvorená množina a runtime ju nevie pokryť — `accept` obsahuje len tvary vypísané
v kľúči. Úlohy zostávajú v banke, lebo zadanie tvar prakticky vynucuje („Vypíš
z prvého odseku…", doplnenie do vety), takže prirodzená odpoveď je medzi vypísanými
tvarmi. Domýšľať ďalšie pády by bolo hádanie sémantiky, čo `02-BANKA-OTAZOK.md`
zakazuje. Ak sa pri hraní ukáže, že to vadí, riešením je doplniť `accept`, nie
zapnúť fuzzy porovnávanie.
