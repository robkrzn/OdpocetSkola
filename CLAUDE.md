# Odpočet do začiatku školského roka

Jednostránkový statický odpočet. Obrovské číslice **dni : hodiny : minúty : sekundy : stotiny**,
pod nimi text „za tento čas ti začína školský rok“. Stránka sa posiela ako správa cez
Facebook / Instagram, takže náhľad linku (OG preview) je súčasť produktu, nie extra.

## Stack

- `index.html`, `style.css`, `main.js` — nič viac.
- **Žiadny framework, žiadny build step.** GitHub Pages servíruje repo priamo.
- **Plain CSS, nie SCSS.** Vnorenie aj premenné vie natívne CSS (`&`, `--var`).
  SCSS pridať až keď bude treba `@use`/partials naprieč viacerými stránkami — teraz je jedna.
- Bez závislostí. Bez npm. Ak niečo vyžaduje `package.json`, je to skoro isto zlá cesta.

## Kľúčové rozhodnutia

**Cieľový dátum je jedna konštanta v `main.js`:**
```js
const TARGET = new Date('2026-09-02T08:00:00+02:00'); // Po: 1.9. je štátny sviatok
```
Vždy s explicitným offsetom `+02:00` — inak odpočet ukazuje iný čas návštevníkovi
v inom pásme. Neparsovať dátum bez offsetu.

**Stotiny → `requestAnimationFrame`, nie `setInterval`.** Interval driftuje a pri
100 tickoch/s zbytočne páli batériu. rAF beží na obnovovacej frekvencii displeja
a sám sa pozastaví na skrytom tabe.

**Po dosiahnutí nuly** sa odpočet zastaví na nulách a text sa prepne na oznámenie,
že školský rok už začal. Žiadne záporné čísla.

**Šírka číslic:** `font-variant-numeric: tabular-nums`, aby layout neposkakoval
pri každej stotine. Toto je pri tomto projekte povinné, nie kozmetika.

## Náhľad na sociálnych sieťach (OG)

Statický hosting nevie vygenerovať obrázok s aktuálnym časom pri každom zdieľaní,
a FB/IG si náhľad navyše agresívne cachujú. Preto:

- `og:title` / `og:description` / `og:image` sú v `index.html` napevno.
- Zostávajúci čas v popise je v **dňoch** — jemnejšia granularita by bola klamstvo,
  lebo náhľad sa neaktualizuje v reálnom čase.
- Aktualizáciu popisu (a prípadne OG obrázka) rieši GitHub Action s denným cronom,
  ktorý prepíše `content` v meta tagoch a commitne. Strop: náhľad je presný
  na jeden deň, nie na minútu — a už rozposlané správy si podržia starú cache.
- `og:image` musí byť absolútna URL (`https://…`), relatívna cesta scraperom nestačí.
  Rozmer 1200×630, `og.jpg`. JPEG, nie PNG — zrno smaltu sa v PNG nekomprimuje
  a obrázok narástol na 627 kB, čo je desaťnásobok celej stránky.

Ak by mal náhľad ukazovať naozaj živý čas, znamená to serverless funkciu mimo
GitHub Pages (napr. Vercel OG). To je iný hosting — riešiť len ak si to používateľ vypýta.

## Deploy

GitHub Pages z koreňa `main` vetvy. Žiadny build → žiadny deploy workflow.
Súbory v repo = súbory na webe.

## Štýl práce

- Najkratší funkčný diff. Toto je stránka s jedným číslom, nie aplikácia.
- Zámerné zjednodušenia označiť komentárom `ponytail:` aj so stropom
  (napr. `// ponytail: OG popis v dňoch, minútová presnosť by chcela server`).
- Slovenské texty v UI vrátane skloňovania („1 deň / 2 dni / 5 dní“).
