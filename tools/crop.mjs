// Orezanie uz vyrenderovanej stranky PDF (z `pdftoppm -r 150 -png`) na obsah
// jednej ulohy. Rovnaky headless Chrome, aky repo uz pouziva na og.jpg -
// ziadna nova zavislost, ziadny ImageMagick.
//
//   node tools/crop.mjs <vstup.png> <x> <y> <sirka> <vyska> <vystup.png>
//
// Suradnice zapisuje clovek alebo agent, ktory stranku vidi - automaticka
// detekcia ramca obrazka nie.
import { writeFileSync, mkdtempSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Ziadna --version probe: na tomto stroji `chrome.exe --version` nevytlaci verziu
// a nevrati sa, ale otvori bezny prehliadac. Radsej rovno skusit spustit orez -
// zla cesta zlyha s citatelnou chybou od Node (ENOENT), rovnako jasnou ako probe.
const chrome = process.env.CHROME_PATH || (
  process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' :
  process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' :
  'google-chrome'
);

const [, , input, xArg, yArg, wArg, hArg, output] = process.argv;
if (!input || !output || [xArg, yArg, wArg, hArg].some(v => v === undefined)) {
  console.error('použitie: node tools/crop.mjs <vstup.png> <x> <y> <šírka> <výška> <výstup.png>');
  process.exit(1);
}
const [x, y, w, h] = [xArg, yArg, wArg, hArg].map(Number);
if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) {
  console.error('x, y, šírka a výška musia byť čísla; šírka a výška kladné');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`vstup neexistuje: ${input}`);
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'crop-'));
const html = join(dir, 'crop.html');
const imgUrl = pathToFileURL(resolve(input)).href;

// Obrazok posunuty o -x/-y v okne presne w x h - co je vo viewporte, je orez.
writeFileSync(html, `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;overflow:hidden}
img{position:absolute;left:${-x}px;top:${-y}px;max-width:none}</style>
<img src="${imgUrl}">`);

mkdirSync(dirname(resolve(output)), { recursive: true });

execFileSync(chrome, [
  '--headless', '--disable-gpu', '--hide-scrollbars',
  `--window-size=${w},${h}`,
  `--screenshot=${resolve(output)}`,
  pathToFileURL(html).href,
], { stdio: 'inherit' });

rmSync(dir, { recursive: true, force: true });
console.log(`orezané: ${output} (${w}×${h} od ${x},${y})`);
