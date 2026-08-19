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
**dni : hodiny : minúty : sekundy : stotiny** — a pod ním veta
„za tento čas ti začína školský rok“.

Úspech = príjemca otvorí link, pochopí vtip do dvoch sekúnd a pošle ho ďalej.
Nie je to nástroj ani služba; je to pointa v tvare webstránky.

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
- **Sezónna relevancia:** posledné týždne prázdnin 2026. Po 2.9.2026 je stránka
  už len archív vlastného vtipu.

## Capabilities and Constraints

- **Cieľový okamih:** 2. 9. 2026, 08:00 Europe/Bratislava (`2026-09-02T08:00:00+02:00`).
  1. 9. 2026 je Deň Ústavy SR — štátny sviatok, vyučovanie začína až v stredu.
  Zapísané ako **jedna konštanta**, nie ako počítaná logika: jednorazovka na rok 2026.
- **Stotiny** znamenajú ~100 aktualizácií za sekundu → `requestAnimationFrame`,
  nie `setInterval`. Číslice v `tabular-nums`, inak layout poskakuje pri každom ticku.
- **Po dosiahnutí nuly** sa odpočet zastaví na nulách a text sa prepne na oznámenie,
  že školský rok už začal. Žiadne záporné hodnoty.
- **Statický hosting nevie vygenerovať náhľad s aktuálnym časom.** Zostávajúci čas
  v `og:description` môže byť nanajvýš v **dňoch**, prepisovaný denným cron GitHub
  Actionom. Jemnejšia granularita v náhľade by bola klamstvo. Živý čas v náhľade
  by znamenal serverless funkciu mimo GitHub Pages — mimo rozsahu.
- `og:image` musí byť **absolútna URL** (1200×630); relatívna cesta scraperom nestačí.
- **Jazyk: slovenčina**, tykanie. Vrátane skloňovania číseloviek („1 deň / 2 dni / 5 dní“).
- **URL:** `https://robkrzn.github.io/OdpocetSkola/` (repozitár `robkrzn/OdpocetSkola`,
  vetva `main`). Absolútne URL v meta tagoch si prepisuje GitHub Action sám podľa
  `github.repository`, takže sa nerozsypú ani pri premenovaní repozitára.

## Brand Commitments

Žiadna značka, logo ani identita. Záväzné je len:

- veta **„za tento čas ti začína školský rok“** (formulácia od používateľa),
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
