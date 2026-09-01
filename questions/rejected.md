# Vyradené úlohy

Úlohy, ktoré sú v origináli testu, ale do banky nevstúpili — podľa R7 v
`.doc/00-KONTEXT.md` a sekcie „Čo do banky nevstúpi" v `.doc/02-BANKA-OTAZOK.md`
berieme len strojovo overiteľné úlohy.

Log nie je administratíva: pri druhom prechode sa z neho dá vybrať, čo doplniť.
Dôvod `obrázok` je zámerne oddelený od ostatných — sú to úlohy, ktoré sa dajú
vrátiť do banky bez nového rozhodovania, len čo bude na stroji `pdftoppm`
a úloha dostane `asset`. Ostatné dôvody sú trvalé.

| id | dôvod | čo v úlohe je |
|---|---|---|
| mat-2024-a-03 | obrázok | Kruhový diagram s piatimi percentami (12/16/28/24/20 %) priradenými k piatim koreňom rovnice. Priradenie výseč ↔ koreň nie je z textu odvoditeľné a žiadny invariant ho neurčuje. |
| mat-2024-a-06 | obrázok | Rovnoramenný lichobežník ABCD, hľadá sa uhol δ. V texte nie je ani jedna miera; 120° a 25° sú len v obrázku a ich poloha rozhoduje. |
| mat-2024-a-07 | obrázok | Sieť štvorbokého hranola s podstavou kosodĺžnika. Text dáva len strany 30 cm a 20 cm; výška kosodĺžnika (16 cm) aj dĺžka hranola sú len v obrázku. |
| mat-2024-a-13 | obrázok | Stavba z kvádrových dielov v rohu miestnosti. Počet dielov sa dá zistiť len z priestorového obrázka. |
| mat-2024-a-20 | obrázok | Ktorý zo štyroch koláčových diagramov zobrazuje správne rozdelenie minút. Možnosti A–D sú samotné obrázky, v texte nerozlíšiteľné. |
| mat-2024-a-24 | obrázok | Ktorá sieť kocky zodpovedá zvýraznenému vrcholu. Možnosti A–D sú obrázky sietí. |
| mat-2024-a-28 | obrázok | Bodový graf dvanástich súťažiacich v dvoch disciplínach. Pravdivosť piatich tvrdení závisí od polohy mien v grafe. |

**mat-2024-a: 7 vyradených z 30 (23 %), všetky s dôvodom `obrázok`.**
**sjl-2024-a: 0 vyradených z 30.** Test neobsahuje nahrávku, úlohu na voľný text ani
úlohu závislú od obrázka; obe tabuľky (medailová bilancia, údaje o karete) sú
prepísané do `stimulus.body` ako HTML.
