# Odpočet — tabuľa + WhatsApp pripomienka

Dva výstupy z jedného odpočtu: statická tabuľa na GitHub Pages a denná WhatsApp
pripomienka cez Actions. Prevádzkové príkazy, secrets a Meta sú v `README.md`.

Jednostránkový statický odpočet v podobe klapkovej odchodovej tabule. Obrovské číslice
**dni : hodiny : minúty : sekundy : stotiny** a nič iné — žiadny sprievodný text,
žiadne tlačidlo. Stránka sa posiela ako správa cez Messenger / Instagram, takže
**náhľad linku je súčasť produktu, nie extra**.

Produktová pravda je v `PRODUCT.md`, vizuálny systém v `DESIGN.md`. Tento súbor je len
pracovná príručka — neduplikuj sem ich obsah.

## Stack

- Tabuľa: `index.html`, `style.css`, `stops.js`, `main.js`, `fonts/`, `og.jpg`.
- Pripomienka: `send.js` + `.github/workflows/daily.yml`. Čistý Node, bez závislostí.
- **Žiadny framework, žiadny build step.** GitHub Pages servíruje repo priamo.
- **Plain CSS, nie SCSS.** Natívne CSS vie vnorenie aj premenné a nepotrebuje kompiláciu.
- Bez závislostí. Bez npm. Ak niečo vyžaduje `package.json`, je to skoro isto zlá cesta.
- Súbory sú na disku **CRLF**. Skripty, ktoré ich patchujú, to musia zniesť.

## Kľúčové rozhodnutia

**Cieľové okamihy sú pole `STOPS` v `stops.js`** — dva, nie jeden:
```js
{ at: '2026-09-01T07:50:00+02:00', ... }   // Deň Ústavy SR už nie je dňom pracovného pokoja
{ at: '2027-03-17T08:00:00+01:00', ... }   // Testovanie 9; marec je ešte zimný čas
```
Vždy s explicitným offsetom — bez neho ukazuje odpočet iný čas návštevníkovi v inom
pásme. Keď prvý termín prejde, tabuľa prebehne kaskádou a prehodí sa na druhý; po
druhom skončí na `ŽIADNE ĎALŠIE ODCHODY`. Žiadne záporné čísla.

**`stops.js` je jediný zdroj — nikdy nekopíruj termín inam.** Číta ho tabuľa
(`<script>` pred `main.js`), `.github/og.mjs` aj `send.js` (cez `module.exports`
na konci súboru; `import`/`require` fungujú, lebo repo nemá `package.json`).
Predtým boli tri kópie v dvoch repozitároch a už raz si začali protirečiť —
tabuľa hlásila „Testovanie 9", správa „Monitora".

**Texty viazané na zastávku patria k zastávke**, nie do `main.js`: `dest`, `name`,
`rail`, `line`, `what` (2. pád do „Do … zostáva") a `shouts`. Výkriky sú per-zastávka
zámerne — „Koniec prázdnin!" po 1. 9. už nedáva zmysel.

**Stotiny → `requestAnimationFrame`, nie `setInterval`.** Interval driftuje a pri
100 tickoch/s páli batériu. rAF sa navyše sám pozastaví na skrytom tabe.

**Stotiny sa nikdy nepreklopia.** Menia sa rýchlejšie, než stihne lístok spadnúť, tak
sa znak len prehadzuje pod trvalým rozmazaním. Pri `prefers-reduced-motion` zamrznú
prázdne — práve ten panikáriaci stĺpec si používateľ vypol.

**`<title>`, `description` a `og:image:alt` nesmú byť statické.** Menia sa so
zastávkou, prepisuje ich `og.mjs`. Živému návštevníkovi navyše nastaví titulok
`paintTexts()` hneď, lebo cron beží až raz za 3 h.

**Šírka číslic:** `font-variant-numeric: tabular-nums`. Povinné, nie kozmetika.

**Rozmazanie patrí na vnútorné `<i>`, nikdy na `.flap`.** Puzdro je pevný hardvér,
točí sa len znak.

**Všetko škáluje z `--cell` / `--lead` a pomeru `--ch`.** Nikdy nehardcoduj šírku bunky,
veľkosť písma, priemer čapu ani polomer rozmazania. Bunky reagujú aj na výšku displeja
cez `min(vw, vh)` — bez toho stránka na 375×667 pretekala o 111 px.

**Bez viditeľného ovládača.** Kaskádu a zvonec spúšťa `pointerdown` kdekoľvek plus
`Enter`/`Space`. Zvonec je syntetizovaný cez WebAudio, žiadny zvukový súbor.

## Náhľad linku (OG)

Statický hosting nevie vygenerovať obrázok s aktuálnym časom, a FB/IG si náhľad navyše
agresívne cachujú. Preto:

- **Obrázok je statický, počet dní nesie popis.** V `og.jpg` nie je ani jedna číslica —
  pole času je rozmazané do pohybu. Akékoľvek konkrétne číslo v obrázku by bolo od
  prvého dňa nepravdivé.
- **Veta „za tento čas ti začína školský rok“ žije len tu**, nie na stránke. `.line` je
  `display:none` a zapína sa až v `body.og`. V zozname správ je tabuľa malá, číslice
  rozmazané a nikto ešte neklikol — tam tú vetu treba.
- **Počet dní patrí do `og:title`, nie do `og:description`.** Messenger a Instagram
  zobrazia v zozname správ z náhľadu len obrázok a titulok — popis zahodia. Vetu
  „za tento čas ti začína školský rok“ nesie samotný `og.jpg`, titulok teda nesie číslo.
- **Absolútne URL a počet dní v `og:title` prepisuje `.github/workflows/og.yml`**
  pri každom pushi a každé 3 hodiny, podľa `github.repository`. Ručne ich needituj.
- Granularita je v **dňoch**. Jemnejšia by bola klamstvo, náhľad sa nerefreshuje.

### Prekreslenie `og.jpg`

`og.jpg` je screenshot `index.html?og=1` v 1200×630. **Prekresľuje ho `og.yml` sám**
pri každom behu (headless Chrome + `python3 -m http.server`). Render je deterministický,
takže sa commitne len skutočná zmena — v praxi pri preklopení zastávky alebo po zmene
dizajnu. Ručne do súboru nesiahaj, prepíše ťa cron.

Lokálny kontrolný screenshot potrebuje **lokálny http server** — cez `file://` sa
`fonts/archivo-narrow-latin-ext.woff2` neuloží kvôli CORS a Š/Č/Ž/Ľ/Ť vypadnú na
náhradný font:

```bash
python3 -m http.server 8765 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --hide-scrollbars --window-size=1200,630 --screenshot=/tmp/og.png \
  "http://localhost:8765/index.html?og=1"
```

**OG náhľad berie zastávku z hodín, nie natvrdo nultú.** Mal tam `phase = 0` a po
1. 9. by obrázok tvrdil školský rok, kým `og:title` nad ním už hlási Testovanie 9.

JPEG, nie PNG: zrno smaltu sa v PNG nekomprimuje a obrázok narástol na 627 kB, čo je
desaťnásobok celej stránky.

Živý čas v náhľade by znamenal serverless funkciu mimo GitHub Pages. Iný hosting —
riešiť len ak si to používateľ vypýta.

## WhatsApp pripomienka

`send.js` posiela cez Meta Cloud API template `odpocet_pripomienka` s dvoma premennými
(cieľ, odpočet); zvyšok textu aj URL tlačidlo sú v template, nie v kóde. Beží denne
o 15:00 Europe/Bratislava.

**Actions cron mešká, aj hodiny.** Preto sa `send.js` neriadi hodinou behu, ale
`SCHEDULE` (`github.event.schedule`) — tá povie, ktorý z dvoch cronov beh spustil,
a meškaním sa nemení. Meškajúci beh dobehne do 21:59, potom sa zahodí.

Po každej zmene `send.js` alebo `stops.js`: `node send.js --test` (20+ assertov —
skloňovanie, prepínanie zastávok, letný/zimný čas, okno odoslania, parsovanie chýb Mety).

Secrets, Meta konzola a ručné odoslanie sú v `README.md`.

## Deploy

GitHub Pages z koreňa vetvy `main`, repozitár `robkrzn/OdpocetSkola`, adresa
`https://robkrzn.github.io/OdpocetSkola/`. Žiadny build → žiadny deploy workflow.
Súbory v repe = súbory na webe. `send.js` a `stops.js` sa tým pádom servírujú tiež —
neobsahujú nič tajné, secrets sú v GitHube.

## Štýl práce

- Najkratší funkčný diff. Toto je stránka s jedným číslom, nie aplikácia.
- Zámerné zjednodušenia označiť komentárom `ponytail:` aj so stropom.
- Slovenské texty vrátane skloňovania („1 deň / 2 dni / 5 dní“).
- Nové farby a tiene berú najbližší existujúci stupeň rampy `--shade-*` / `--sheen-*`.
  Nezavádzaj novú alfa hodnotu — deväť ad-hoc čiernych alf je stav, z ktorého sa rampa
  robila, a rozdiel medzi `.55` a `.6` nikdy nebol rozhodnutie.
