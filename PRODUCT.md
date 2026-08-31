# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Statické HTML + CSS + JS, bez frameworku a bez build stepu — rozhodnutie používateľa.
Deploy je GitHub Pages z koreňa repozitára, takže súbory v repe = súbory na webe.
Plain CSS namiesto SCSS (natívne vnorenie a `--premenné` pokryjú jednu stránku bez
kompilácie); SCSS je otvorená možnosť, ak by pribudla druhá stránka.

## Users

**Príjemca (primárny):** kamarát alebo spolužiak, ktorému používateľ pošle link ako
správu. Otvára ho na **telefóne, vo vstavanom prehliadači Messengeru alebo Instagramu**,
v priebehu pár sekúnd, uprostred konverzácie. Nič nehľadá a nič nevypĺňa — pozrie sa,
pochopí vtip, ide ďalej alebo pošle link ďalšiemu.

**Odosielateľ:** používateľ (Robert). Jeho úlohou je poslať link a nechať náhľad,
aby odviedol prácu za neho.

## Product Purpose

Jedna obrazovka s obrovským odpočtom do začiatku školského roka —
**dni : hodiny : minúty : sekundy : stotiny**. Na stránke samotnej nie je nič iné:
žiadny sprievodný text, žiadne tlačidlo.

Úspech = príjemca otvorí link, pochopí vtip do dvoch sekúnd a pošle ho ďalej.
Nie je to nástroj ani služba; je to pointa v tvare webstránky.

## Druhý výstup: denná WhatsApp pripomienka

Ten istý odpočet chodí raz denne o 15:00 na WhatsApp ako správa s odkazom na tabuľu.
Publikum je iné a užšie — **Paulinka a Robert**, nie náhodný príjemca linku. Tu nejde
o vtip v zozname správ, ale o pripomenutie, že sa termín blíži. Tón zostáva rovnaký:
škodoradosť medzi svojimi, nie strašenie.

Beží na GitHub Actions cez Meta Cloud API. Text správy je v schválenom template,
kód posiela len dve premenné (cieľ, odpočet) — meniť formuláciu znamená meniť template
v Mete, nie kód.

## Positioning

Payload nesie **náhľad linku, nie stránka**. Vtip musí zafungovať už v zozname správ,
bez jediného kliknutia — otvorenie stránky je bonus, nie podmienka.
To je celý rozdiel oproti hociktorému generickému countdown generátoru,
ktorý v správe vyzerá ako prázdny odkaz.

## Operating Context

- Distribúcia výhradne cez **osobné správy** (Messenger, Instagram DM), nie cez vyhľadávanie.
- Facebook a Instagram si náhľad **scrapujú raz a agresívne cachujú** — už rozposlané
  správy si podržia starú verziu náhľadu aj po zmene meta tagov.
- Prevažne **mobil, na výšku, in-app prehliadač** (obmedzený viewport, žiadna adresná lišta,
  často aj tmavý režim systému). Toto je referenčné zariadenie, nie desktop.
- **Sezónna relevancia:** tabuľa nekončí prvým septembrom. Po odchode školského roka
  sa sama prehodí na **Testovanie 9 (17. 3. 2027)** a beží ďalej — vtip sa zo
  škodoradosti nad koncom prázdnin mení na škodoradosť nad blížiacim sa testom.
  Archívom sa stáva až po 17. 3. 2027.

## Capabilities and Constraints

- **Cieľové okamihy sú dva**, zapísané ako konštanty v `stops.js`, nie ako počítaná logika:
  1. 9. 2026, 07:50 (`2026-09-01T07:50:00+02:00`) — Deň Ústavy SR už nie je dňom
  pracovného pokoja, vyučovanie začína priamo 1. 9.; a 17. 3. 2027, 08:00
  (`2027-03-17T08:00:00+01:00`) — Testovanie 9, marec je ešte zimný čas.
  `stops.js` je **jediný zdroj pre tabuľu, náhľad linku aj WhatsApp pripomienku**.
- **Stotiny** znamenajú ~100 aktualizácií za sekundu → `requestAnimationFrame`,
  nie `setInterval`. Číslice v `tabular-nums`, inak layout poskakuje pri každom ticku.
- **Po dosiahnutí nuly** sa tabuľa prehodí na ďalšiu zastávku; po poslednej skončí na
  `ŽIADNE ĎALŠIE ODCHODY`. Žiadne záporné hodnoty. Všetky texty viazané na zastávku
  (`<title>`, description, `og:*`, veta, výkriky, aj obrázok `og.jpg`) sa prepínajú s ňou.
- **Statický hosting nevie vygenerovať náhľad s aktuálnym časom.** Zostávajúci čas
  v `og:title` môže byť nanajvýš v **dňoch**, prepisovaný denným cron GitHub
  Actionom. Jemnejšia granularita v náhľade by bola klamstvo. Živý čas v náhľade
  by znamenal serverless funkciu mimo GitHub Pages — mimo rozsahu.
- `og:image` musí byť **absolútna URL** (1200×630); relatívna cesta scraperom nestačí.
- **Jazyk: slovenčina**, tykanie. Vrátane skloňovania číseloviek („1 deň / 2 dni / 5 dní“).
- **URL:** `https://robkrzn.github.io/OdpocetSkola/` (repozitár `robkrzn/OdpocetSkola`,
  vetva `main`). Absolútne URL v meta tagoch si prepisuje GitHub Action sám podľa
  `github.repository`, takže sa nerozsypú ani pri premenovaní repozitára.

## Brand Commitments

Žiadna značka, logo ani identita. Záväzné je len:

- **väzba „za tento čas ti začína …“** (formulácia od používateľa). Od 19. 8. 2026
  žije **len v náhľade linku — v `og.jpg` a v `<title>`**, nie na stránke; `og:title` nesie
  počet dní, lebo Messenger popis zahodí. Na obrazovke je veta redundantná
  vedľa cieľa a obrovského čísla, ale v zozname správ nesie celú pointu, kým nikto neklikol.
  Doplnok sa mení so zastávkou (`line` v `stops.js`): „…školský rok“ → „…Testovanie 9“;
  samotná väzba je záväzná, dopĺňaný cieľ nie,
- **tón:** hravá škodoradosť medzi kamarátmi — trolljenie, nie urážka.
  Bez nadávok, bez šikany, bez mierenia na konkrétnu osobu alebo školu.

## Evidence on Hand

Žiadne. Nijaké logá, fotky, fonty, texty ani dáta neboli dodané.
Budúca práca **nesmie vymyslieť** názov školy, mesto, meno adresáta, počty žiakov,
citáty ani žiadny iný fakt, ktorý pôsobí ako skutočný.

## Product Principles

1. **Náhľad je produkt.** Ak vtip nefunguje v zozname správ, stránka zlyhala.
2. **Jedno číslo, jedna obrazovka.** Žiadna navigácia, päta, cookie lišta ani „o projekte“.
3. **Referenčné zariadenie je telefón v in-app prehliadači**, nie 27" monitor.
4. **Škodoradosť, nie krutosť.** Vtip má rozosmiať aj toho, komu je adresovaný.
5. **Žiadny build step.** Čokoľvek, čo si vyžiada `package.json`, je skoro isto zlá cesta.

## Accessibility & Inclusion

- Stotiny sa menia ~100×/s — **nesmú byť oznamované čítačkou obrazovky**
  (žiadne `aria-live` na tikajúcich číslach; kompletný zostávajúci čas sprístupniť
  jedným statickým, zriedka aktualizovaným textovým ekvivalentom).
- Rešpektovať `prefers-reduced-motion` pri akejkoľvek dekoratívnej animácii.
  Samotný odpočet je obsah, nie efekt — ten beží ďalej.
- Kontrast textu voči pozadiu musí spĺňať WCAG AA; veľké číslice sú veľký text,
  sprievodná veta nie.
