# Odpočet do začiatku školského roka

Jednostránkový statický odpočet v podobe klapkovej odchodovej tabule. Obrovské číslice
**dni : hodiny : minúty : sekundy : stotiny** a nič iné — žiadny sprievodný text,
žiadne tlačidlo. Stránka sa posiela ako správa cez Messenger / Instagram, takže
**náhľad linku je súčasť produktu, nie extra**.

Produktová pravda je v `PRODUCT.md`, vizuálny systém v `DESIGN.md`. Tento súbor je len
pracovná príručka — neduplikuj sem ich obsah.

## Stack

- `index.html`, `style.css`, `main.js`, `fonts/`, `og.jpg` — nič viac.
- **Žiadny framework, žiadny build step.** GitHub Pages servíruje repo priamo.
- **Plain CSS, nie SCSS.** Natívne CSS vie vnorenie aj premenné a nepotrebuje kompiláciu.
- Bez závislostí. Bez npm. Ak niečo vyžaduje `package.json`, je to skoro isto zlá cesta.
- Súbory sú na disku **CRLF**. Skripty, ktoré ich patchujú, to musia zniesť.

## Kľúčové rozhodnutia

**Cieľové okamihy sú pole `STOPS` na začiatku `main.js`** — dva, nie jeden:
```js
{ at: '2026-09-02T08:00:00+02:00', ... }   // 1.9. je štátny sviatok, škola začína v stredu
{ at: '2027-03-17T08:00:00+01:00', ... }   // Testovanie 9; marec je ešte zimný čas
```
Vždy s explicitným offsetom — bez neho ukazuje odpočet iný čas návštevníkovi v inom
pásme. Keď prvý termín prejde, tabuľa prebehne kaskádou a prehodí sa na druhý; po
druhom skončí na `ŽIADNE ĎALŠIE ODCHODY`. Žiadne záporné čísla.
Ak meníš dátumy, **rovnaké termíny sú aj v `.github/og.mjs`** — musia sedieť.

**Stotiny → `requestAnimationFrame`, nie `setInterval`.** Interval driftuje a pri
100 tickoch/s páli batériu. rAF sa navyše sám pozastaví na skrytom tabe.

**Stotiny sa nikdy nepreklopia.** Menia sa rýchlejšie, než stihne lístok spadnúť, tak
sa znak len prehadzuje pod trvalým rozmazaním. Pri `prefers-reduced-motion` zamrznú
prázdne — práve ten panikáriaci stĺpec si používateľ vypol.

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

`og.jpg` je screenshot `index.html?og=1` v 1200×630. **Po každej vizuálnej zmene ho
treba prekresliť**, inak náhľad ukazuje starý dizajn. Potrebuješ headless prehliadač
(Edge aj Chrome sú na tomto stroji) a **lokálny http server** — cez `file://` sa
`fonts/archivo-narrow-latin-ext.woff2` neuloží kvôli CORS a Š/Č/Ž/Ľ/Ť vypadnú na
náhradný font. To isté platí pre akýkoľvek kontrolný screenshot.

JPEG, nie PNG: zrno smaltu sa v PNG nekomprimuje a obrázok narástol na 627 kB, čo je
desaťnásobok celej stránky.

Živý čas v náhľade by znamenal serverless funkciu mimo GitHub Pages. Iný hosting —
riešiť len ak si to používateľ vypýta.

## Deploy

GitHub Pages z koreňa vetvy `main`, repozitár `robkrzn/OdpocetSkola`, adresa
`https://robkrzn.github.io/OdpocetSkola/`. Žiadny build → žiadny deploy workflow.
Súbory v repe = súbory na webe.

## Štýl práce

- Najkratší funkčný diff. Toto je stránka s jedným číslom, nie aplikácia.
- Zámerné zjednodušenia označiť komentárom `ponytail:` aj so stropom.
- Slovenské texty vrátane skloňovania („1 deň / 2 dni / 5 dní“).
- Nové farby a tiene berú najbližší existujúci stupeň rampy `--shade-*` / `--sheen-*`.
  Nezavádzaj novú alfa hodnotu — deväť ad-hoc čiernych alf je stav, z ktorého sa rampa
  robila, a rozdiel medzi `.55` a `.6` nikdy nebol rozhodnutie.
