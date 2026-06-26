/**
 * Regenerate combo + thali photos as proper steel-thali platters, matching the
 * owner's reference (public/brand/_ref-thali.png). Uses nano-banana edit.
 * Run: node scripts/gen-combos.mjs [id ...]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  const env = path.resolve(ROOT, '../shared-keys/fal.env');
  if (fs.existsSync(env)) FAL_KEY = (fs.readFileSync(env, 'utf8').match(/^FAL_KEY=(.+)$/m) || [])[1]?.trim();
}
if (!FAL_KEY) { console.error('FAL_KEY missing'); process.exit(1); }
const H = { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' };

const REF = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'public/brand/_ref-thali.png')).toString('base64');
const KEEP = 'Match the exact style of the reference: a round steel thali platter with several small steel katori bowls, an Indian clay cup of lassi, on a dark moody restaurant table with warm bokeh lights behind. Realistic editorial Indian restaurant food photography, warm cinematic lighting, appetizing, no text, no logo.';

const JOBS = [
  ['combo-a', 'Arrange onion bhaji, a rich lamb curry, basmati rice, crisp papadum, a gulab jamun dessert and a lassi.'],
  ['combo-b', 'Arrange a chicken kebab, creamy butter chicken, basmati rice, crisp papadum, a dessert and a lassi.'],
  ['combo-c', 'Arrange samosas, chicken tikka masala, basmati rice, crisp papadum, a dessert and a lassi.'],
  ['combo-d-veggie', 'Arrange vegetable pakora, malai kofta, basmati rice, crisp papadum, a dessert and a lassi.'],
  ['combo-aa', 'A generous thali for two: onion bhaji, seekh kabab, tandoori chicken, lamb curry, rice, naan and several side katoris.'],
  ['combo-bb-veggie', 'A vegetarian thali for two: assorted pakora, paneer curry, malai kofta, naan, rice and several side katoris.'],
  ['combo-cc', 'A thali for two: samosa, seekh kabab, chicken tikka masala, lamb bhuna, palak paneer, naan and side katoris.'],
  ['combo-dd-veggie', 'A vegetarian thali for two: pakora, onion bhaji, malai kofta, tarka daal, rice and side katoris.'],
  ['veggie-thali', 'A classic vegetarian thali: a vegetable curry, tarka daal, basmati rice, naan, raita, salad, a dessert and a lassi.'],
  ['non-veg-thali', 'A non-vegetarian thali: a chicken curry, basmati rice, naan, raita, salad, a dessert and a lassi.'],
  ['lamb-thali', 'A generous lamb thali: rich lamb curry, basmati rice, naan, raita, salad, a dessert and a lassi.'],
  ['family-deal', 'A large family feast on the same dark moody table: several big serving dishes of butter chicken, whole tandoori chicken, chana masala, mixed vegetables, a basket of naan, a platter of samosas, bowls of rice and desserts, shot from above, warm cinematic lighting, no text, no logo.', true],
];

async function gen([id, prompt, isFamily]) {
  const res = await fetch('https://fal.run/fal-ai/nano-banana/edit', {
    method: 'POST', headers: H,
    body: JSON.stringify({
      prompt: isFamily ? prompt : `${prompt} ${KEEP}`,
      image_urls: [REF], num_images: 1, output_format: 'jpeg',
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 140)}`);
  const url = (await res.json()).images[0].url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(path.join(ROOT, 'public/menu', `${id}.jpg`), buf);
  console.log(`✓ ${id} (${(buf.length / 1024).toFixed(0)} KB)`);
}

const only = process.argv.slice(2);
for (const job of JOBS) {
  if (only.length && !only.includes(job[0])) continue;
  let ok = false;
  for (let a = 0; a < 3 && !ok; a++) {
    try { await gen(job); ok = true; }
    catch (e) { console.error(`  retry ${job[0]} (${a + 1}): ${e.message}`); await new Promise(r => setTimeout(r, 2500)); }
  }
  if (!ok) console.error(`✗ ${job[0]}: gave up`);
}
console.log('combos done.');
