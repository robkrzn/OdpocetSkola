// questions/raw/*.json (jeden subor na test) -> questions/mat.json + questions/sjl.json.
// Zlievanie je samostatny skript preto, lebo dva agenti nikdy nepisu do toho isteho
// suboru (CLAUDE.md) - kazdy tazi vlastny questions/raw/<test>.json a tento skript
// az potom vsetko poskladá dokopy.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(DIR, '..', 'questions', 'raw');
const OUT_DIR = join(DIR, '..', 'questions');

const rawFiles = readdirSync(RAW_DIR).filter(f => f.endsWith('.json'));
if (!rawFiles.length) throw new Error(`v ${RAW_DIR} nie sú žiadne *.json súbory`);

const bySubject = {};

for (const file of rawFiles) {
  const raw = JSON.parse(readFileSync(join(RAW_DIR, file), 'utf8'));
  const { subject, year, form, source, stimuli, units, items } = raw;
  if (!subject || !year || !form || !source || !stimuli || !units || !items) {
    throw new Error(`${file}: chýba povinné pole (subject/year/form/source/stimuli/units/items)`);
  }

  bySubject[subject] ??= { subject, sources: [], stimuli: {}, units: [], items: {} };
  const bank = bySubject[subject];

  bank.sources.push({ year, form, test: source.test, key: source.key });

  // Id su uz namespacovane <subject>-<rok>-<forma>-..., zrazka by znamenala
  // dvojite tazenie toho isteho testu - radsej padnut nahlas ako ticho prepisat.
  for (const [sid, s] of Object.entries(stimuli)) {
    if (sid in bank.stimuli) throw new Error(`${file}: stimulus id "${sid}" už existuje - duplicitné ťaženie`);
    bank.stimuli[sid] = s;
  }
  for (const [id, it] of Object.entries(items)) {
    if (id in bank.items) throw new Error(`${file}: item id "${id}" už existuje - duplicitné ťaženie`);
    bank.items[id] = it;
  }
  bank.units.push(...units);
}

// Servirovana banka drzi slub "5 otazok na predmet": jednotka nad CHUNK uloh sa
// rozreze na co najrovnomernejsie casti s tou istou ukazkou (7 -> 4+3). V raw
// suboroch zostava cela - tam je verna kopia testu, kde citacia ukazka ma naozaj
// sedem otazok. Bez tohto rezu davalo SJL sedem otazok na 60 % dni.
// ponytail: strop 5; keby raz pribudol rezim "cely test", cita sa z questions/raw/
const CHUNK = 5;
const chunkUnit = u => {
  if (u.ids.length <= CHUNK) return [u];
  const parts = Math.ceil(u.ids.length / CHUNK);
  const size = Math.ceil(u.ids.length / parts);
  const out = [];
  for (let i = 0; i < u.ids.length; i += size) out.push({ ...u, ids: u.ids.slice(i, i + size) });
  return out;
};

const generated = new Date().toISOString().slice(0, 10);
let total = 0;

for (const bank of Object.values(bySubject)) {
  const itemCount = Object.keys(bank.items).length;
  total += itemCount;
  const units = bank.units.flatMap(chunkUnit);
  const out = {
    subject: bank.subject,
    version: 1,
    generated,
    itemCount,
    sources: bank.sources,
    stimuli: bank.stimuli,
    units,
    items: bank.items,
  };
  const outFile = join(OUT_DIR, `${bank.subject}.json`);
  writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
  console.log(`${outFile}: ${itemCount} úloh, ${units.length} jednotiek, ${bank.sources.length} zdrojov`);
}

console.log(`spolu ${total} úloh`);
