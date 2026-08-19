// Prepise absolutne URL v meta tagoch podla mena repozitara a doplni pocet dni
// do og:description. Bezi len v GitHub Actions - lokalne netreba nic spustat.
import { readFileSync, writeFileSync } from 'node:fs';

const [owner, repo] = (process.env.REPO || '').split('/');
if (!owner || !repo) throw new Error('chyba premenna REPO (owner/repo)');

// user.github.io sa servuje z korena, kazdy iny repozitar z podadresara
const base = repo.toLowerCase() === owner.toLowerCase() + '.github.io'
  ? `https://${owner.toLowerCase()}.github.io/`
  : `https://${owner.toLowerCase()}.github.io/${repo}/`;

// Musi sedet s STOPS v main.js.
const STOPS = [
  { at: '2026-09-02T08:00:00+02:00', what: 'začiatku školského roka' },
  { at: '2027-03-17T08:00:00+01:00', what: 'Testovania 9' }
];

const pl = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

const now = Date.now();
const next = STOPS.find(s => Date.parse(s.at) > now);

// Nahlad si Facebook aj Instagram cachuju, takze jemnejsia granularita ako dni
// by bola klamstvo - do minuty by uz nesedela.
const desc = next
  ? `Do ${next.what} zostáva ${Math.ceil((Date.parse(next.at) - now) / 86400000)} ` +
    `${pl(Math.ceil((Date.parse(next.at) - now) / 86400000), 'deň', 'dni', 'dní')}. ` +
    'Odpočet beží na stotiny.'
  : 'Odpočet skončil. Tabuľa nemá ďalší odchod.';

let html = readFileSync('index.html', 'utf8');

function set(attr, name, value) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(">)`);
  if (!re.test(html)) throw new Error(`meta ${name} sa nenasiel`);
  html = html.replace(re, `$1${value}$2`);
}

set('property', 'og:url', base);
set('property', 'og:image', base + 'og.jpg');
set('property', 'og:description', desc);
set('name', 'twitter:image', base + 'og.jpg');
set('name', 'twitter:description', desc);

writeFileSync('index.html', html);
console.log(base + '\n' + desc);
