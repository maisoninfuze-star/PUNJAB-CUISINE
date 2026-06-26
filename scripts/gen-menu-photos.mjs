/**
 * Generate real desi-restaurant menu photos with nano-banana (Gemini 2.5 Flash
 * Image) via fal.ai, styled to match the uploaded reference (dish in a
 * terracotta bowl, bright daylight, homely authentic Indian food).
 *
 * Usage:
 *   node scripts/gen-menu-photos.mjs <id1> <id2> ...   # specific items
 *   node scripts/gen-menu-photos.mjs --all             # everything missing
 *   node scripts/gen-menu-photos.mjs --signatures      # homepage signatures
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  const env = path.resolve(ROOT, '../shared-keys/fal.env');
  if (fs.existsSync(env)) {
    const m = fs.readFileSync(env, 'utf8').match(/^FAL_KEY=(.+)$/m);
    if (m) FAL_KEY = m[1].trim();
  }
}
if (!FAL_KEY) { console.error('FAL_KEY missing'); process.exit(1); }
const H = { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' };

// Reference image (the uploaded clay-bowl example) as a data URI.
const refPath = path.resolve(ROOT, 'public/brand/_ref-dish.png');
if (!fs.existsSync(refPath)) {
  console.error('Reference not found at', refPath, '- copy the example PNG there first.');
  process.exit(1);
}
const refDataUri = 'data:image/png;base64,' + fs.readFileSync(refPath).toString('base64');

// Parse lib/menu.ts directly (no TS runtime needed). Each item is declared as
//   i('id', 'name', price, 'category', 'description', { ...opts })
function loadMenu() {
  const src = fs.readFileSync(path.resolve(ROOT, 'lib/menu.ts'), 'utf8');
  const re = /\bi\('([^']+)',\s*'([^']+)',\s*([\d.]+),\s*'([^']+)',\s*'([^']+)'\s*(?:,\s*(\{[^}]*\}))?\s*\)/g;
  const items = [];
  let m;
  while ((m = re.exec(src))) {
    const opts = m[6] || '';
    items.push({
      id: m[1],
      name: m[2],
      price: parseFloat(m[3]),
      category: m[4],
      description: m[5],
      signature: /signature:\s*true/.test(opts),
    });
  }
  return items;
}
const MENU = loadMenu();

const STYLE =
  'Keep the exact same style as the reference image: the same rustic terracotta/clay bowl, the same plain woven mat and neutral background, the same bright natural daylight, the same realistic homely authentic Indian restaurant food photography, same top three-quarter camera angle and framing. Do NOT make it fancy fine-dining. Square photo, appetising, no text, no hands, no cutlery.';

function promptFor(item) {
  return `Replace the food in the bowl with a realistic serving of "${item.name}" — ${item.description} ${STYLE}`;
}

async function genOne(item, force) {
  const out = path.join(ROOT, 'public', 'menu', `${item.id}.jpg`);
  if (!force && fs.existsSync(out)) { console.log(`• skip ${item.id} (exists)`); return true; }
  const res = await fetch('https://fal.run/fal-ai/nano-banana/edit', {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      prompt: promptFor(item),
      image_urls: [refDataUri],
      num_images: 1,
      output_format: 'jpeg',
    }),
  });
  if (!res.ok) { console.error(`✗ ${item.id}: ${res.status} ${(await res.text()).slice(0,200)}`); return false; }
  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) { console.error(`✗ ${item.id}: no image`); return false; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`✓ ${item.id}  (${(buf.length/1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  let targets;
  if (args.includes('--all')) targets = MENU;
  else if (args.includes('--signatures')) targets = MENU.filter((m) => m.signature);
  else targets = MENU.filter((m) => args.includes(m.id));
  if (targets.length === 0) { console.error('No matching items. Pass ids, --all, or --signatures.'); process.exit(1); }
  const force = args.includes('--force');
  console.log(`Generating ${targets.length} photo(s)…`);
  let ok = 0;
  for (const item of targets) {
    try { if (await genOne(item, force)) ok++; } catch (e) { console.error(`✗ ${item.id}:`, e.message); }
  }
  console.log(`done — ${ok}/${targets.length}`);
}
main();
