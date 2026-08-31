// Prepise absolutne URL v meta tagoch podla mena repozitara a doplni pocet dni
// do og:title. Bezi len v GitHub Actions - lokalne netreba nic spustat.
import { readFileSync, writeFileSync } from 'node:fs';
import STOPS from '../stops.js';

const [owner, repo] = (process.env.REPO || '').split('/');
if (!owner || !repo) throw new Error('chyba premenna REPO (owner/repo)');

// user.github.io sa servuje z korena, kazdy iny repozitar z podadresara
const base = repo.toLowerCase() === owner.toLowerCase() + '.github.io'
  ? `https://${owner.toLowerCase()}.github.io/`
  : `https://${owner.toLowerCase()}.github.io/${repo}/`;

const pl = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

const now = Date.now();
const next = STOPS.find(s => Date.parse(s.at) > now);

// Nahlad si Facebook aj Instagram cachuju, takze jemnejsia granularita ako dni
// by bola klamstvo - do minuty by uz nesedela. Floor, nie ceil - tabula na stranke
// pocita dni tiez floorom a nahlad musi hlasit to iste cislo.
const days = next && Math.floor((Date.parse(next.at) - now) / 86400000);

// Messenger a IG v zozname sprav zobrazia z nahladu len titulok, takze pocet dni
// patri tam. Vetu "za tento čas ti začína školský rok" uz nesie samotny og.jpg.
const title = next
  ? `Do ${next.what} zostáva ${days} ${pl(days, 'deň', 'dni', 'dní')}`
  : 'Odpočet skončil';
const desc = next
  ? 'Klapková odchodová tabuľa. Odpočet beží na stotiny.'
  : 'Tabuľa nemá ďalší odchod.';

// <title>, description a og:image:alt boli natvrdo o skolskom roku. Po prvom
// odchode by klamali, tak ich prepisuje ten isty beh ako og:title.
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const pageTitle = next ? cap(next.line) : 'Odpočet skončil';
const pageDesc = next
  ? `Odpočet do ${next.what} na dni, hodiny, minúty, sekundy a stotiny.`
  : 'Odpočet skončil. Tabuľa nemá ďalší odchod.';
const imgAlt = next
  ? `Klapková odchodová tabuľa s odpočtom do ${next.what}.`
  : 'Klapková odchodová tabuľa po poslednom odchode.';

let html = readFileSync('index.html', 'utf8');

function set(attr, name, value) {
  const re = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(">)`);
  if (!re.test(html)) throw new Error(`meta ${name} sa nenasiel`);
  html = html.replace(re, `$1${value}$2`);
}

const reTitle = /(<title>)[^<]*(<\/title>)/;
if (!reTitle.test(html)) throw new Error('<title> sa nenasiel');
html = html.replace(reTitle, `$1${pageTitle}$2`);

set('name', 'description', pageDesc);
set('property', 'og:image:alt', imgAlt);
set('property', 'og:url', base);
set('property', 'og:image', base + 'og.jpg');
set('property', 'og:title', title);
set('property', 'og:description', desc);
set('name', 'twitter:image', base + 'og.jpg');
set('name', 'twitter:title', title);
set('name', 'twitter:description', desc);

writeFileSync('index.html', html);
console.log(`${base}\n${pageTitle}\n${title}\n${desc}`);
