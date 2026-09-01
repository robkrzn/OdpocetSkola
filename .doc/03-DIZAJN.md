# 03 · Dizajn v2 — direction contract pre `impeccable`

Tento súbor je **vstup pre `impeccable`**, nie hotový dizajn. Určuje, čo je pevné a čo
je otvorené. Vizuálne rozhodnutia patria dizajnovej fáze (`04-PLAN.md`, F4), tento
dokument jej dáva rámec a inventár.

## Čo je pevné a nediskutuje sa

**Svet zostáva.** Pragotron klapková tabuľa na smaltovanej stene. Nie „inšpirovaný",
ten istý. Existujúci systém je zdokumentovaný v `DESIGN.md` a strojovo v
`.impeccable/design.json` (schemaVersion 2) — tokeny, rampa, komponenty, pravidlá.
Nový dizajn ich **rozširuje, neprepisuje**. Dôvod nie je sentiment: odpočet v rohu
zostáva na obrazovke, takže dva jazyky vedľa seba by boli viditeľná chyba.

Konkrétne pevné body:
- Farby výhradne z existujúcich tokenov (`--enamel`, `--board`, `--ink*`, `--signal`,
  `--hw-*`) a rampy `--shade-0…5` / `--sheen-0…3`. **Žiadna nová alfa, žiadna nová farba.**
- Archivo Narrow, `font-variant-numeric: tabular-nums` na všetkom číselnom.
- One-Ramp Rule, Recess Rule, Metal-Is-Not-Ink Rule, Housing-Is-Fixed Rule,
  Cell-Derived Type Rule, Fixed-Cell Rule — platia bez zmeny.
- Referenčné zariadenie je **375×667, telefón, na výšku**. Desktop je druhý.
- Bez frameworku, bez build stepu, plain CSS.

## Mobile first — nie mobile-also

Rozhodnutie R9 v `00-KONTEXT.md`. Nie je to preferencia, je to jediný prípad, ktorý
naozaj nastane: štrnásťročný k tomuto nepríde na počítači. Konkrétne to znamená päť
vecí a všetkých päť je kontrolovateľných:

1. **CSS sa píše od telefóna nahor.** Základné pravidlá platia pre 375px; desktop je
   `@media (min-width: …)`. Žiadne `max-width` media query, ktoré niečo *odoberá* —
   to je desktop-first prezlečený za responzívny.
2. **Layout sa rozhoduje na telefóne.** Ak sa niečo nezmestí na 375×667, mení sa
   layout, nie sa hľadá výhovorka „na mobile to používateľ doscrolluje".
3. **Desktop sa kontroluje ako posledný,** nie ako prvý. Gate F5 to má v tomto poradí.
4. **Palec, nie kurzor.** Ovládacie prvky patria do dolnej polovice obrazovky —
   potvrdenie odpovede a prechod na ďalšiu úlohu sú v dosahu palca, nie pri ukážke
   hore. Žiadny hover ako nosič informácie, min. 44×44px, medzi možnosťami skutočná
   medzera (susedné tapovateľné riadky bez medzery sú najčastejší mobilný preklep).
5. **In-app prehliadač je referenčné prostredie**, nie Safari na plnú obrazovku —
   link prichádza cez Messenger a Instagram. To znamená `100dvh` nie `100vh`,
   `env(safe-area-inset-*)` a žiadna závislosť na adresnej lište. v1 tu už jednu
   chybu mala (pretečenie o 111px na 375×667) a to pravidlo zostáva: **po každej
   zmene rozmerov sa najprv pozrie 375×667.**

Desktop nie je zanedbaný, len druhý: je to rozšírenie tej istej sústavy, kde sa
odpočet vráti do rohu a úloha dostane pohodlnejšiu šírku riadka (max ~66 znakov).

## Tri pravidlá, ktoré hra láme — a ako

Nie obchádzkou, prepisom pravidla. Každé z nich musí skončiť v novom `DESIGN.md`
v novej formulácii.

### 1. One Signal Rule

Dnes: *signálna červená patrí len odídenému spoju a ničomu inému.*
Hra musí označiť zlú odpoveď a to je druhá instancia toho istého pojmu.

**Nová formulácia: signál označuje to, čo si zmeškal.** Odídený spoj a zlá odpoveď.
Nič iné — nie zvýraznenie, nie nadpis, nie tlačidlo.

**Správna odpoveď nedostane zelenú.** Zelená je stena, teda neutrálny podklad; druhá
zelená by rozbila celý systém. Správnosť sa hlási **materiálom, nie farbou** — bunka
sa preklopí a rozsvieti do plného `--ink`, prípadne dostane preraz ako preštiknutá
jazdenka. Vedľajší efekt je prístupnosť: rozdiel nie je len farebný.

**Povinné:** správne aj zlé nesie okrem materiálu aj **glyf** (`✓` / `✕`), aby stav
nebol nikdy len farba alebo len jasnosť.

### 2. All-Caps Signage Rule

Dnes: *každý reťazec mimo klapkovej bunky je verzálkami s trackingom 0,14–0,22em.*
Zadanie úlohy je próza na dva až päť riadkov. Verzálkami je nečitateľné a naviac
kričí, čo je pri učení presne zle.

**Nová formulácia: signage pravidlo platí na chróm, nie na obsah.** Chróm — lišty,
popisky jednotiek, názvy pohľadov, stavové riadky — zostáva verzálkami. Obsah —
zadanie, ukážka, možnosti, správna odpoveď, vysvetlenie témy — je **veta s malými
písmenami, tracking 0, riadkovanie 1,5**.

Nové typografické roly do `design.json`:

| Rola | Použitie | Charakter |
|---|---|---|
| `body` | zadanie úlohy, ukážka | 16–18px, veta, tracking 0, line-height 1.5, `--ink` |
| `option` | text možnosti A–D | o stupeň menšie než `body`, veta, `--ink-2` |
| `answer` | zadaná a správna odpoveď | tabular, bold, `--ink` |
| `stat` | čísla v štatistike | veľké, tabular, mimo klapkovej bunky |

### 3. No-Scroll Rule

Dnes: *tabuľa sa musí zmestiť do jedného viewportu bez scrollovania.*
Ukážka s tabuľkou plus zadanie plus štyri možnosti sa na 375×667 nezmestí a nesmie
sa zmenšovať.

**Nová formulácia: chróm sa nescrolluje, obsah áno.** Rohový odpočet a pás postupu
sú prišpendlené a viditeľné vždy. Telo úlohy scrolluje. Pôvodné pravidlo zostáva
v platnosti **pre tabuľovú plochu a pre náhľad `?og=1`**, kde sa nič neposunulo.

## Odpočet v rohu

Jediný prvok, ktorý sa mení, nie pridáva. Rozhodnutia, ktoré musí dizajnová fáza
potvrdiť alebo vyvrátiť s dôvodom:

- **Jednotky: `dni : hod : min`.** Sekundy a stotiny **len na tabuľovej ploche a
  v náhľade**, nie v rohu. Trvalo rozmazaný stotinový bubon vedľa slovnej úlohy je
  krádež pozornosti a na telefóne aj batérie — a rAF, ktorý beží počas riešenia
  úlohy, je zbytočný. Panikáriaci stĺpec zostáva zážitkom tabuľovej plochy.
- **Veľkosť: polovica.** Nie nová sústava — `--cell` a `--lead` majú v rohovej
  variante nižší `clamp()`, všetko ostatné škáluje samo (Cell-Derived Type Rule).
  Orientačne `--cell: clamp(16px,4vw,30px)`, `--lead: clamp(30px,9vw,54px)`.
- **Umiestnenie:** desktop vpravo nahor, vsadené do steny (nie plávajúca karta —
  Recess Rule). Na telefóne **nie plávajúci roh** — roh nad prózou je najhoršia možná
  pozícia pre čitateľnosť.

- **Na telefóne je odpočet per-pohľad, nie jeden prvok. Toto ruší pôvodné odporúčanie
  „pás na celú šírku hore" pre všetky pohľady** — bolo zmerané na hotovom kompe F4
  a nesedí. Klapkový pás stojí 117 px z 667, čo je 18 % viewportu, a na obrazovke
  úlohy to znamenalo, že **zadanie a možnosti sa nezmestili na jednu obrazovku**.
  Preto:
  - `#/dnes`, `#/vysledok`, `#/vykaz` — **klapkový pás** hore. Tu je odpočet emočný
    motor, žiadna čítacia úloha s ním nesúťaží a tých 117 px je zaplatených.
  - `#/uloha` — **jeden riadok signage textu** (`TESTOVANIE 9 · 196 DNÍ`, veľkosť
    `label`, ~30 px) v tom istom prišpendlenom páse ako postup. Odpočet sa nestratí,
    len prestane stáť 90 px na obrazovke, kde je najmenej potrebný.
  - `#/tabula` — plná tabuľa, päť jednotiek, bez zmeny.
- **Interakcia zostáva, ale zúžená.** `main.js` dnes spúšťa kaskádu, zvonec a výkrik
  na `pointerdown` **kdekoľvek na dokumente**. V hre by tapnutie na odpoveď zazvonilo.
  Nový rozsah: kaskáda, zvonec aj výkriky reagujú **len na samotnú rohovú tabuľu**
  (a na celú plochu tam, kde je tabuľa hlavným prvkom). Výkriky zostávajú aj v tóne
  aj v obsahu — sú to najlepšie tri riadky celého produktu.
- Rohová tabuľa je zároveň **odkaz na plnú tabuľovú plochu** — tam žije v1 zážitok
  v plnej veľkosti.

## Odporúčaná téza (dizajnová fáza ju môže prebiť lepšou)

Stanica má okrem tabule aj **jazdenku a výkaz výpravcu**. Z toho vychádza slovník,
ktorý drží ten istý svet a pritom pomenuje všetky mechaniky hry:

| Mechanika | V svete stanice |
|---|---|
| Denná päťka | dnešný spoj / jazdenka na dnes |
| Správna odpoveď | preštiknutá jazdenka |
| Zlá odpoveď | zmeškaný spoj (signálna červená) |
| Úlohy, čo mu nešli | **spoje s meškaním** — vrátia sa do poriadku |
| Séria dní | dni bez zmeškaného spoja |
| Štatistika | výkaz — zoznam liniek a ich úspešnosti |
| Slabé témy | linky s najväčším meškaním |

Prečo to funguje: nič z toho nie je nálepka na gamifikáciu. „Vráť sa k tomu, čo ti
nešlo" je v tomto slovníku *„dobehni spoj, ktorý ti ušiel"* — tá istá vec, ale
konečne s dôvodom, prečo sa vracia.

Pojmy sú návrh, nie záväzok. Záväzok je, že mechaniky **majú pomenovanie z tohto
sveta**, nie generické („skóre", „úroveň", „odznak").

## Nové komponenty

Dizajnová fáza ich dodá ako `components[]` do `.impeccable/design.json` a opíše
v `DESIGN.md`:

1. **Rohová tabuľa** — zmenšená varianta existujúcej.
2. **Panel úlohy** — vsadený board panel; nesie ukážku a zadanie. Pri skupinovej
   úlohe je ukážka **prišpendlená pri scrollovaní** (inak sa pri štvrtej otázke
   k tabuľke nedá vrátiť), ale **rozbalená len pri prvej otázke skupiny**. Od druhej
   je zbalená na jeden prišpendlený riadok (`UKÁŽKA · Zimné paralympijské hry ⌄`),
   tapnutím sa otvorí. Ukážku človek **prečíta raz**; potom ju potrebuje na
   dohľadanie, nie na čítanie, a 240 px prišpendlenej prózy je presne to, čo vytlačí
   možnosti z obrazovky.

   **Merateľné kritérium, ktoré to musí splniť:** na 375×667 sú **zadanie a všetky
   možnosti viditeľné bez scrollovania**, keď je ukážka zbalená alebo žiadna nie je.
   S rozbalenou ukážkou sa scrollovať smie.
3. **Riadok možnosti** — tapovateľný, min. 44px, vľavo **klapková bunka s literou
   A–D**. Existujúce puzdro v novej funkcii; pri vyhodnotení sa bunka preklopí na
   `✓` alebo `✕`. Toto je najlacnejší a najpresnejší spôsob, ako dostať flip do hry.
4. **Pole krátkej odpovede** — vsadený input, `tabular-nums`, numerická klávesnica
   (`inputmode="decimal"`) pre `num`.
5. **Pás postupu** — 5 + 5 klapkových buniek, prázdne / preštiknuté / zmeškané.
6. **Výkaz** — riadky liniek (tém) s úspešnosťou; 14-dňový pás z klapkových buniek
   ako jediná „grafika". **Žiadny nový typ grafu.**
7. **Panel prezývky a účtu** — jeden input, jedno tlačidlo, žiadny formulár.
8. **Prepínač pohľadov** — chróm, verzálky, cez `location.hash`.

## Obrazovky

| Pohľad | Hash | Obsah |
|---|---|---|
| Dnes | `#/dnes` | rohový odpočet, stav dnešného spoja, tlačidlo štart / pokračovať / hotovo |
| Úloha | `#/uloha` | ukážka, zadanie, možnosti alebo pole, pás postupu |
| Výsledok | `#/vysledok` | 5+5, zmeškané úlohy so správnou odpoveďou, prechod na druhý predmet |
| Výkaz | `#/vykaz` | úspešnosť MAT/SJL, séria, 14-dňový pás, slabé linky |
| Tabuľa | `#/tabula` | v1 plocha v plnej veľkosti, stotiny, kaskáda, zvonec |

## Pohyb

Rozpočet je úzky zámerne. Existujúce `leaf-fall` (108ms) a `leaf-land` (230ms) sú
jediné dve krivky, ktoré smie hra použiť.

Povolené: preklopenie litery možnosti pri vyhodnotení; naplnenie pásu postupu;
kaskáda na rohovej tabuli pri tapnutí; roll-step pri prepnutí zastávky.

Zakázané: konfety, poskočenie skóre, toast správy, prechodové animácie medzi
pohľadmi, „+1" letiace číslo, čokoľvek pružinové. `prefers-reduced-motion` vypína
preklopenie na okamžitú zmenu a mrazí stotiny (už existuje).

## Tón a zábrany proti detskosti

Publikum je 14–15 rokov. Detský dizajn odpadne pri prvom otvorení, nadšený dizajn
pri druhom. Cieľ je **suchý, presný a trochu vtipný** — výpravca, nie animátor.

**Nikdy:** maskot · emoji ako odmena · konfety · „Super! Výborne!" · odznaky, XP,
mince, srdiečka · plamienok pri série · kreslené farby · veľké výkričníky ·
motivačné citáty · rebríček.

**Hranica pre odmeny (séria dní):** odmena smie byť **nálepka na skutočnom čísle
alebo obsah**, nikdy vymyslená mena. Trieda spoja podľa série (`OSOBNÝ` →
`ZRÝCHLENÝ` → `RÝCHLIK` → `EXPRES` → `INTERCITY` → `MEDZINÁRODNÝ`) je nálepka na
počte dní a patrí na lištu tabule ako trieda vlaku. Rekord a rezervy sú tiež čísla.
Čo by porušilo pravidlo: body, mince, srdiečka, úrovne odtrhnuté od dní, obchod
s odmenami. Mechanika je v `01-ARCHITEKTURA.md`, sekcia „Séria dní".

**Strata série sa nedramatizuje.** Žiadny prasknutý plamienok, žiadne „ó nie!".
Padne to na nulu vecne a **vedľa zostane svietiť rekord** — cieľ musí byť viditeľný
v tej istej sekunde, keď človek stratí sériu, inak prestane.

**Áno:** presné číslo · vecná spätná väzba („zmeškané, správne je C") · škodoradosť
existujúcich výkrikov na tabuli, nie v úlohe · ticho tam, kde nie je čo povedať.

## Prístupnosť — nezjednodušuje sa

- Stav odpovede nikdy nie je len farba ani len jasnosť: vždy aj glyf.
- Ciele minimálne 44×44px, medzi možnosťami skutočná medzera.
- Celý priebeh je ovládateľný klávesnicou; `1`–`4` / `A`–`D` vyberajú možnosť,
  `Enter` potvrdí. Focus ring z existujúceho `:focus-visible`.
- Kontrast obsahu ≥ 4,5:1 — `--ink-3` je použiteľný pre chróm, **nie pre zadanie**.
- **`--ink-3` je farba na tabuli, nie na stene.** Dopočítané na kompe F4:
  `--ink-3` (#94A69B) na `--enamel` (#2A5346) je **3,38:1** — pre malé verzálky
  nedostatočné. Na `--board` (#0F1215) je ~7:1 a tam je správne. Najslabší použiteľný
  atrament na smaltovanej stene je **`--ink-2`** (5,39:1). Týka sa to prepínača
  pohľadov, sekčných popiskov (`DNEŠNÝ SPOJ`, `SÉRIA`, `ÚSPEŠNOSŤ`, `SLABÉ LINKY`)
  a popiskov čísel vo výkaze — všetko, čo stojí na zelenej.
- Ukážka, zadanie a možnosti sú skutočný text, nie obrázok, všade kde to ide
  (preto sa tabuľky prepisujú do `<table>`, `02-BANKA-OTAZOK.md`).
- Zmena pohľadu ohlásená pre čítačku; pás postupu má textovú alternatívu.
- Odpočet v rohu je pre čítačku jedna veta, nie 7 buniek (už riešené cez `.sr`).

## Výstupy dizajnovej fázy

1. Schválený komp na **375×667** a na desktope pre pohľady Dnes / Úloha / Výsledok /
   Výkaz.
2. Rozhodnutie o rohovej tabuli (jednotky, pozícia na úzkom telefóne).
3. Nové roly a komponenty v `.impeccable/design.json`.
4. `DESIGN.md` s **prepísanými tromi pravidlami** vyššie a s novými pravidlami hry.
5. Verdikt finish review.
