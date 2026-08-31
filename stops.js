/* Jediny zdroj zastavok pre cely projekt. Cita ho tabula (<script> v index.html),
   generator nahladu (.github/og.mjs) aj WhatsApp pripomienka (send.js).
   Termin menis TU a nikde inde - predtym boli tri kopie v dvoch repozitaroch
   a uz raz si zacali protirecit.

   at     - vzdy s explicitnym offsetom, inak ukazuje odpocet iny cas v inom pasme
   dest   - dva riadky klapiek, max 13 znakov na riadok (LINE_W v main.js)
   what   - 2. pad do vety "Do ... zostava" (nahlad linku aj WhatsApp sprava)
   line   - veta do nahladu linku a do <title>
   shouts - vykriky po tapnuti; kazda zastavka ma vlastne, letne vtipy po 1.9. nesedia */
var STOPS = [
  {
    at: '2026-09-01T07:50:00+02:00',      // Den Ustavy SR uz nie je den pracovneho pokoja, skola zacina 1.9.
    dest: ['ŠKOLSKÝ ROK', '2026/2027'],
    name: 'Školský rok 2026/2027',
    rail: '01.09.2026 · 07:50',
    line: 'za tento čas ti začína školský rok',
    what: 'začiatku školského roka',
    shouts: [
      'Sa ti nechce, čo?',
      'Koniec prázdnin!',
      'Už žiadny spánok do obeda',
      'Budíček o pol siedmej',
      'Kde máš prezúvky?',
      'Domáca úloha už čaká',
      'Matika hneď prvú hodinu',
      'Telefón do skrinky',
      'Čítanie na leto? Ktoré?',
      'Ešte pár dní slobody',
      'Aj tak ťa to nezachráni',
      'Zvoní! ... ešte nie'
    ]
  },
  {
    at: '2027-03-17T08:00:00+01:00',      // marec je este zimny cas, preto +01:00
    dest: ['TESTOVANIE 9', '17.03.2027'],
    name: 'Testovanie 9',
    rail: '17.03.2027 · 08:00',
    line: 'za tento čas ti začína Testovanie 9',
    what: 'Testovania 9',
    shouts: [
      'Matika a slovina, nič iné',
      'Toto ti ráta na strednú',
      'Zlomky. Áno, zase zlomky.',
      'Pravopis sa sám nenaučí',
      'Ceruzka, guma, pravítko',
      'Telefón do skrinky, aj teraz',
      'Cvičné testy sú online',
      'Slovné úlohy čítaj dvakrát',
      'Vyspi sa. Nie o polnoci.',
      'Raňajky nevynechaj',
      'Ešte je čas... zatiaľ',
      'Dýchaj. Zvládneš to.'
    ]
  }
];

// send.js a og.mjs bezia v Node, kde global var nestaci. V prehliadaci sa preskoci.
if (typeof module !== 'undefined') module.exports = STOPS;
