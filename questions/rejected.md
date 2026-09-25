# Vyradené úlohy

Úlohy, ktoré sú v origináli testu, ale do banky nevstúpili — podľa R7 v
`.doc/00-KONTEXT.md` a sekcie „Čo do banky nevstúpi" v `.doc/02-BANKA-OTAZOK.md`
berieme len strojovo overiteľné úlohy.

Log nie je administratíva: pri druhom prechode sa z neho dá vybrať, čo doplniť.
Dôvod `obrázok` je zámerne oddelený od ostatných — sú to úlohy, ktoré sa dajú
vrátiť do banky bez nového rozhodovania, len čo bude na stroji `pdftoppm`
a úloha dostane `asset`. Ostatné dôvody sú trvalé.

Zlúčené z `questions/rejected-<test>.md` (F3, 12 testov ťažených paralelne —
`CLAUDE.md`: jeden agent nikdy nepíše priamo sem). Per-test súbory po zlúčení
zmazané.

## mat-2017-a

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2017-a-05 | obrázok | Uhly 25° a 36° a status ramien (ktoré sú predĺžené za vrchol, ktoré je os uhla β) sú dané výhradne obrázkom trojuholníka, bez neho neriešiteľné. |
| mat-2017-a-09 | obrázok | Tretí rozmer kvádra určuje len usporiadanie šiestich stien v sieti (rozmery 19 cm a 20 cm sú súčty strán podľa rozloženia siete), to je vizuálna informácia, nie textová. |

**2 vyradené z 20 (10 %).**

## mat-2018-a

Nič sa nevyradilo — všetkých 20 úloh je strojovo overiteľných a je v banke.

## mat-2019-a

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2019-a-02 | obrázok | Správna odpoveď (percento žiakov) závisí od skutočného počtu kociek v izometrickom obrázku stavby, ktorý sa dá zistiť len vizuálnym počítaním z obrázka, nie z textu. |
| mat-2019-a-19 | obrázok | Všetky štyri možnosti A–D sú samotné obrázky sietí kocky so symbolmi, správnosť sa dá overiť len porovnaním obrázkov. |
| mat-2019-a-25 | obrázok | Úloha vyžaduje odčítať uhol trojuholníka HRO priamo z obrázka uhlomeru, hodnota nie je nikde vyjadrená číslom v texte. |
| mat-2019-a-27 | obrázok | Úloha porovnáva obsah štyroch zvýraznených útvarov v sieti rovnostranných trojuholníkov; určenie počtu dielikov každého útvaru vyžaduje pohľad na obrázok, nie je odvoditeľné z textu. |
| mat-2019-a-30 | obrázok | Všetky štyri možnosti A–D sú obrázky mriežok s prekrytím čiernymi kruhmi, správna voľba sa dá zistiť len vizuálnym porovnaním so vzorom. |

**5 vyradených z 30 (17 %).**

## mat-2022-a

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2022-a-05 | obrázok | Úloha porovnáva dva bludiskové vzory kreslené priamo čiarami v štvorcovej sieti; rozdiel medzi ľavým a pravým vzorom je čisto vizuálny a bez obrázka sa nedá ani opísať, ani overiť. |
| mat-2022-a-06 | obrázok | Dĺžka cesty v bludisku závisí od presného priebehu čiernej čiary v sieti (koľko úsekov je vodorovných/zvislých dĺžky 7 mm), čo je vizuálna informácia bez číselnej opory v texte. |
| mat-2022-a-16 | obrázok | Možnosti A–D sú samotné obrázky (štyri varianty uloženia dlaždíc v rohu Y), nie text. |
| mat-2022-a-19 | obrázok | Súčet troch stien pri vrchole P (12) neurčuje jednoznačne súčet pri vrchole Q — klasické pravidlo pre protiľahlé vrcholy kocky (21 − 12 = 9) dáva inú hodnotu než kľúč (14). Obrázok ukazuje kocku so skutočnými počtami bodiek na stenách a P, Q zdieľajúce jednu stenu, nie sú protiľahlé; to je vizuálna informácia, ktorú vetou nemožno nahradiť bez straty jednoznačnosti. Pôvodne vyťažené ako riešiteľné textom (agent prepísal na všeobecné pravidlo o protiľahlých vrcholoch), pri gate vyradené — bez obrázka by riešiteľ postupujúci správnou všeobecnou úvahou dostal inú, nesprávnu odpoveď (9 namiesto 14). |
| mat-2022-a-26 | obrázok | Možnosti A–D sú samotné obrázky (štyri varianty nárysu), nie text. |
| mat-2022-a-27 | obrázok | Odhad priemeru kmeňa vychádza z pomeru k postave na skutočnej fotografii; bez fotografie neexistuje žiadne číslo v zadaní, z ktorého by sa dalo vychádzať. |

**6 vyradených z 30 (20 %).**

## mat-2023-a

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2023-a-18 | obrázok | Tri telesá (kocka, kváder, valec) poskladané do stavieb; hľadá sa, ktorý zo štyroch pohľadov zhora na stavbu z nich by nemohol mať práve dve poschodia. Možnosti A–D sú samotné obrázky pôdorysov, v texte nerozlíšiteľné. |

**1 vyradená z 30 (3 %).**

## mat-2024-a

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2024-a-03 | obrázok | Kruhový diagram s piatimi percentami (12/16/28/24/20 %) priradenými k piatim koreňom rovnice. Priradenie výseč ↔ koreň nie je z textu odvoditeľné a žiadny invariant ho neurčuje. |
| mat-2024-a-06 | obrázok | Rovnoramenný lichobežník ABCD, hľadá sa uhol δ. V texte nie je ani jedna miera; 120° a 25° sú len v obrázku a ich poloha rozhoduje. |
| mat-2024-a-07 | obrázok | Sieť štvorbokého hranola s podstavou kosodĺžnika. Text dáva len strany 30 cm a 20 cm; výška kosodĺžnika (16 cm) aj dĺžka hranola sú len v obrázku. |
| mat-2024-a-13 | obrázok | Stavba z kvádrových dielov v rohu miestnosti. Počet dielov sa dá zistiť len z priestorového obrázka. |
| mat-2024-a-20 | obrázok | Ktorý zo štyroch koláčových diagramov zobrazuje správne rozdelenie minút. Možnosti A–D sú samotné obrázky, v texte nerozlíšiteľné. |
| mat-2024-a-24 | obrázok | Ktorá sieť kocky zodpovedá zvýraznenému vrcholu. Možnosti A–D sú obrázky sietí. |
| mat-2024-a-28 | obrázok | Bodový graf dvanástich súťažiacich v dvoch disciplínach. Pravdivosť piatich tvrdení závisí od polohy mien v grafe. |

**7 vyradených z 30 (23 %).**

## mat-2025-a

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2025-a-04 | obrázok | Farbenie trojuholníkov v trojuholníkovej sieti krok po kroku (1, 3, 6 pridaných); ako pokračovanie na 4. a 5. krok (kľúč: spolu 31) závisí od geometrického tvaru šírenia zobrazeného len na obrázku – bežné pokračovania radu (trojuholníkové čísla, kumulatívny súčet) dávajú 35, nie 31, takže rad nie je dourčiteľný z textu bez pohľadu na obrázok. |

**1 vyradená z 30 (3 %).**

## sjl-2017-a … sjl-2025-a

**0 vyradených.** Žiadny zo siedmich ročníkov SJL neobsahuje nahrávku, úlohu na voľný
text ani úlohu závislú od obrázka bez invariantu — všetky tabuľky a grafy (medailová
bilancia, recyklačná schéma, časová os) sú prepísané do `stimulus.body` ako HTML alebo
súvislý text.

---

**Spolu MAT: 22 vyradených zo 190 (12 %), 168 v banke.**
**Spolu SJL: 0 vyradených z 200 (0 %), 200 v banke.**
**Spolu obe banky: 368 úloh, priechod (want=4/deň) ~40 dní na predmet**
(`.doc/01-ARCHITEKTURA.md`, sekcia „Priechod bankou").
