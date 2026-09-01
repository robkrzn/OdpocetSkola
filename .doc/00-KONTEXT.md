# 00 · Kontext v2 — z odpočtu sa stáva tréner na Testovanie 9

Tento priečinok je **kontext pre implementáciu v2**, nie dokumentácia hotového stavu.
Každý súbor je samostatne čitateľný, aby si nové vlákno načítalo len ten svoj.

| Súbor | Kedy ho vlákno potrebuje |
|---|---|
| `00-KONTEXT.md` | vždy prvý — produktová pravda, rozsah, rozhodnutia |
| `01-ARCHITEKTURA.md` | dátový model, Firebase, výber dennej päťky, repo layout |
| `02-BANKA-OTAZOK.md` | PDF → JSON, schéma úlohy, validácia, QA |
| `03-DIZAJN.md` | direction contract pre `impeccable`, nové komponenty |
| `04-PLAN.md` | fázy, agenti, gate kritériá, prompty do nových vlákien |

`PRODUCT.md`, `DESIGN.md`, `CLAUDE.md` a `README.md` v koreni **zostávajú v platnosti**
pre v1 vrstvu (tabuľa, OG náhľad, WhatsApp). Čo im v2 protirečí, je vymenované nižšie
v „Čo v2 láme na v1 pravdách" — nikde inde. Priečinok začína bodkou, takže ho
GitHub Pages ani Jekyll neservírujú.

## Jedna veta

Tabuľa prestáva byť len vtip: **odpočet sa zmenší do rohu a hlavnou plochou sa stane
denná päťka otázok z matematiky a slovenčiny z historických Testovaní 9**, ktorá si
pamätá, čo ti nešlo.

## Autorské právo — stav a rozhodnutie

Testy Testovania 9 sú chránené autorským právom NIVAM a ich výnimka pokrýva
„didaktické nekomerčné účely na školách". Bolo to vznesené a **rozhodnuté: ideme.**
Dôvod je proporcia — nekomerčná appka pre jednu-dvoch deviatačiek, bez reklám, bez
registrácie e-mailom, s odkazom na originálne PDF.

Čo z toho zostáva ako pracovné pravidlo, lebo to nič nekostuje a drží ten predpoklad
pravdivý:

- **Uvedenie zdroja u každej úlohy** — rok, predmet, forma, číslo úlohy a odkaz na
  originálne PDF na `www2.nucem.sk`. To je aj tak lepší produkt.
- **`<meta name="robots" content="noindex">`** na stránke hry. „Nikto sa k tomu viac
  nedostane" je pravda len dovtedy, kým to neindexuje Google. Jeden riadok.
- Žiadosť na NIVAM zostáva ako **možnosť, nie gate**. Zmysel dostane vtedy, ak sa
  na to naozaj nachytá viac než pár spolužiakov — čo je zámer produktu, takže tá
  chvíľa môže prísť.

Detaily a fallback (vlastné zadania podľa vzoru) sú v `02-BANKA-OTAZOK.md`.

## Prečo vôbec

v1 je pointa v tvare webstránky — otvoríš, zasmeješ sa, pošleš ďalej. Funguje, ale má
strop: po druhom otvorení už nemá čo dať. v2 dáva tomu istému odpočtu dôvod vrátiť sa
zajtra. Odpočet zostáva emočným motorom („zostáva 197 dní"), príprava je to, čo z toho
robí použiteľnú vec.

## Používatelia

**Paulinka (primárna).** Deviatačka, telefón, večer, 5–10 minút. Nechce appku na učenie,
chce si odškrtnúť, že dnes niečo urobila. Odpadne pri čomkoľvek, čo vyzerá ako výukový
portál pre druhákov alebo ako domáca úloha.

**Spolužiaci (sekundárni, rastový kanál).** Prídu cez poslaný link. Musia pochopiť do
troch sekúnd, čo tu môžu urobiť, a začať bez registrácie. Účet si vytvoria až keď im
niečo hrozí, že sa stratí.

**Robert (operátor).** Dopĺňa banku otázok, nič neprevádzkuje denne. Neplatí za nič.

## Rozsah v2

**V rozsahu**
- Odpočet zmenšený do rohu, rovnaký svet a rovnaké tokeny.
- Denná päťka: 5 otázok MAT + 5 otázok SJL z historických testov.
- Vyhodnotenie hneď po odpovedi, správne riešenie viditeľné.
- Štatistika: úspešnosť celkovo, po predmetoch a po témach.
- **Séria dní s rezervami a triedou spoja** — návratový motor, viď R10.
- Návrat k úlohám, ktoré mu historicky nešli (Leitner-lite, `01-ARCHITEKTURA.md`).
- Účet bez osobných údajov: anonymné prihlásenie + prezývka.
- Banka otázok vyťažená z oficiálnych PDF, vrátane úloh so spoločnou ukážkou.

**Mimo rozsahu (a prečo)**
- Časomiera a tlak na rýchlosť — Testovanie 9 má vlastný čas, tréning nemá byť stres.
- Verejný rebríček, priateľstvá, chat — vyžaduje moderáciu a osobné údaje. Zdieľaná
  denná päťka pokrýva 90 % tej istej motivácie zadarmo (`01-ARCHITEKTURA.md`).
- Celé cvičné testy na jeden raz, vysvetlenia postupov, video — iný produkt.
- Účet učiteľa, triedy, zadávanie úloh.
- Angličtina (viď rozhodnutie R1).
- Push notifikácie — WhatsApp pripomienka už existuje a je zaplatená pozornosťou.

## Rozhodnutia

**R1 · Predmety sú matematika a slovenský jazyk a literatúra. Potvrdené.**
Testovanie 9 sa z angličtiny nepíše. Druhý jazyk existuje len ako jazyk národnostnej
menšiny (maďarský) pre okresy, ktoré sa nás netýkajú. Banka má teda dva predmety,
`mat` a `sjl`, a `subject` je pole schémy len preto, že to nič nekostuje —
nie ako plán na tretí balík.

**R2 · Tá istá URL, tá istá stránka.** Žiadny druhý repozitár, žiadna podstránka.
`https://robkrzn.github.io/OdpocetSkola/` ostáva a stáva sa domovom hry. Dôvod:
distribúcia beží cez poslaný link a link už koluje. Cena: OG náhľad musí predať aj hru,
nielen odpočet (`01-ARCHITEKTURA.md`, sekcia OG).

**R3 · Runtime zostáva statický.** Žiadny framework, žiadny build step, žiadne npm.
Banka otázok je vygenerovaný **artefakt commitnutý do repa** (`questions/*.json`);
generuje ju offline nástroj, ktorý beží ručne, nie pri načítaní stránky. Rozdiel oproti
build stepu: keď nástroj zhorí, stránka beží ďalej.

**R4 · Firebase až v druhom kroku.** v2.0 ide s `localStorage` a bez backendu — funguje
okamžite, offline a bez registrácie. v2.1 pridá anonymné prihlásenie a Firestore, ktorý
si **adoptuje** existujúci lokálny postup. Nie je to škrtnutie účtu, je to poradie:
kvôli synchronizácii nemá zmysel blokovať to, čo funguje bez nej.

**R5 · Odpovede sú v repe verejné.** `questions/*.json` obsahuje kľúč a servíruje sa
z Pages. Neriešime to: kľúče sú verejné PDF od štátu a kto chce podvádzať vlastnú
prípravu, nepotrebuje na to devtools.

**R6 · Žiadne osobné údaje, ani dobrovoľne.** Bez e-mailu, bez mena, bez veku, bez
školy, bez triedy. Identita = anonymný `uid` od Firebase. Prezývka je jediný text, ktorý
používateľ zadá, a UI ho pri jej zadávaní **výslovne pýta ako prezývku, nie ako meno**.
Dôvod nie je len GDPR, ale to, že publikum sú maloletí a my nechceme byť správcom
ich údajov.

**R7 · Do banky vstupuje len strojovo overiteľná úloha.** Výber z možností a krátka
numerická alebo jednoslovná odpoveď áno; „narysuj", „vysvetli", „napíš krátku úvahu" nie.
Vyradené úlohy sa nezahodia ticho — zapíšu sa do logu s dôvodom (`02-BANKA-OTAZOK.md`).

**R8 · Bez frameworku. Potvrdené, s pomenovanou záchrannou cestou.**
Angular bol návrh na stole preto, že appka zásadne pribrala funkcionalitu — legitímna
úvaha, ale tá funkcionalita je päť pohľadov, jeden dátový zdroj a jeden formulár typu
„vyber A–D". Framework by tu neriešil zložitosť, len ju pridal (npm, build step,
deploy workflow) a najviac by prekážal práve tam, kde je kód najcitlivejší: odpočet
prepisuje DOM ~100×/s cez `requestAnimationFrame`.

**Záchranná cesta je Vue 3 z CDN ako ESM, bez buildu** — nie Angular. Vue má oficiálny
no-build režim, takže „súbory v repe = súbory na webe" zostáva v platnosti, a je to
vec, ktorú tu už niekto pozná. Merateľné spúšťače, kedy ju vytiahnuť, sú
v `01-ARCHITEKTURA.md`, sekcia „Frontend technológia". Angular by prišiel na rad až
pri druhej stránke so zdieľanými komponentmi a je to vtedy vlastná fáza s deploy
workflow, nie vedľajší efekt.

**R9 · Mobile first, nie mobile-also.** Referenčné zariadenie je telefón na výšku,
375×667. Nie preto, že je to malý okrajový prípad, ale preto, že je to **jediný
prípad, ktorý naozaj nastane** — štrnásťročný nepríde k tomuto na počítači. Dôsledky
sú v `03-DIZAJN.md`, sekcia „Mobile first", a sú konkrétne: CSS sa píše od telefóna
nahor, layout sa rozhoduje na telefóne a desktop je len rozšírenie, ktoré sa
kontroluje **ako posledné**.

**R10 · Séria dní je návratový motor, prevzatý z Duolinga bez jeho ekonomiky.**
Denná séria, o ktorú človek nechce prísť. Víkend ju nepretrhne, plus 2 rezervy za
každých 7 dní, takže sa dá vynechať aj piatok až pondelok. Pri strate padne na nulu,
ale **traťový rekord zostáva navždy viditeľný** — to je jediná vec, ktorú Duolingo
robí zle a ktorú kopírovať nebudeme.

Odmena je **nálepka na skutočnom čísle, nie mena**: trieda spoja podľa série
(`OSOBNÝ` → `RÝCHLIK` → `EXPRES` → `INTERCITY` → `MEDZINÁRODNÝ`), rekord a rezervy.
Žiadne body, mince, srdiečka ani obchod s odmenami — to by rozbilo tón, ktorý drží
celý produkt (`03-DIZAJN.md`). Mechanika a jej výpočet sú v `01-ARCHITEKTURA.md`,
sekcia „Séria dní"; podstatné je, že **séria sa neukládá, počíta sa z množiny
dokončených dní** — počítadlo by driftovalo a po synchronizácii by sa rozišlo s dátami.

## Čo v2 láme na v1 pravdách

Tieto tri veci si v koreňových dokumentoch vyžadujú prepis, keď v2 dosadne. Do tej doby
platí, že tu je novšia pravda:

1. **`PRODUCT.md`: „Na stránke samotnej nie je nič iné."** Prestáva platiť. Ostáva ako
   pravda o **OG náhľade a o tabuľovej ploche**, nie o stránke.
2. **`DESIGN.md`, One Signal Rule: signálna červená patrí len odídenému spoju.**
   Hra potrebuje označiť zlú odpoveď. Riešenie v `03-DIZAJN.md` — pravidlo sa
   rozširuje na „signál označuje negatívne", nie obchádza.
3. **`DESIGN.md`, All-Caps Signage Rule: každý reťazec mimo klapky je verzálkami.**
   Zadanie úlohy je próza a verzálkami je nečitateľné. `03-DIZAJN.md` zavádza rolu
   pre bežný text a signage pravidlo zúžuje na chróm.

Ďalej: `main.js` dnes spúšťa kaskádu, zvonec a výkriky na `pointerdown` **kdekoľvek**.
V hre by to znamenalo, že tapnutie na odpoveď zazvoní. Interakcia sa musí zúžiť na
samotnú rohovú tabuľu — je to prvý konkrétny zásah do existujúceho kódu.

## Otvorené otázky

| # | Otázka | Ako pokračujeme, kým nie je odpoveď |
|---|---|---|
| O1 | Máme PDF testov po ruke, alebo ich stahujeme z NIVAM? | Archív je overený a verejný (`www2.nucem.sk`), PDF majú textovú vrstvu; `04-PLAN.md` F0a vyzbiera URL |
| O2 | ~~Koľko rokov spätne?~~ | Zavreté F0: **sedem ročníkov** 2017–2019 a 2022–2025 (2020 a 2021 sa nekonali, COVID). ~150 použiteľných úloh na predmet = priechod ~38 dní. Rozšírenie 2010–2016 je voliteľná F3b, rozhoduje sa po F1 |
| O3 | Zdieľaná denná päťka pre všetkých, alebo osobná? | Ideme zdieľanou (4 zdieľané + 1 osobná), zdôvodnenie v `01-ARCHITEKTURA.md` |
| O4 | Prezývka nech je jedinečná? | Nie. `uid` je identita, prezývka je nálepka. Jedinečnosť si vyžaduje ďalšiu kolekciu a rieši problém, ktorý nemáme |
| O5 | ~~Dá NIVAM súhlas?~~ | Zavreté. Rozhodnuté ísť bez žiadosti, viď „Autorské právo". Ostáva `noindex` a uvedenie zdroja |
| O6 | ~~Angular áno alebo nie?~~ | Zavreté ako R8: nie, záchranná cesta je Vue 3 z CDN bez buildu |
| O7 | Koľko úloh denne pri malej banke? | Zostáva **4 + 1 opakovanie** na predmet. Priechod ~38 dní znamená ~5 priechodov do marca — opakovanie po 5 týždňoch je zámer, nie dôvod znižovať dávku |
| O8 | Doinštalovať poppler (`pdftoppm`)? | **Áno, a je to jediná otvorená vec, ktorá mení rozsah.** Bez neho skončí MAT banka na ~84 úloh proti gate ≥ 120 a musí sa robiť F3b (2010–2016). S ním nie. Tabuľka výnosov je v `04-PLAN.md`, sekcia F3b |
