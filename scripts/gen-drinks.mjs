/**
 * Regenerate the DRINKS photos with the right reference per drink:
 *  - hot  → cutting-chai glasses (public/brand/_ref-drink-hot.png)
 *  - cold → tall saffron-drink glass (public/brand/_ref-drink-cold.png)
 *  - soda/water → realistic can+bottle via text-to-image (no reference)
 *
 * Run: node scripts/gen-drinks.mjs
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

const dataUri = (p) =>
  'data:image/png;base64,' + fs.readFileSync(path.resolve(ROOT, p)).toString('base64');
const REF = {
  hot: dataUri('public/brand/_ref-drink-hot.png'),
  cold: dataUri('public/brand/_ref-drink-cold.png'),
};

const KEEP_HOT =
  'Keep the exact same setting and style as the reference: small Indian cutting-chai glasses, warm brown cinematic lighting, steel kettle and whole spices nearby, same shallow depth of field. Realistic authentic Indian drink photography, no text, no logo.';
const KEEP_COLD =
  'Keep the exact same style as the reference: a tall clear glass on a small ceramic saucer, moody dark warm background, garnish on top, same shallow depth of field. Realistic authentic Indian drink photography, no text, no logo.';

const JOBS = [
  { id: 'masala-tea', ref: 'hot', prompt: `authentic hot masala chai — milky spiced tea — filling the cutting-chai glasses. ${KEEP_HOT}` },
  { id: 'mango-lassi', ref: 'cold', prompt: `replace the drink with a thick mango lassi, pale golden-yellow, topped with saffron strands and chopped pistachio. ${KEEP_COLD}` },
  { id: 'sweet-lassi', ref: 'cold', prompt: `replace the drink with a creamy white sweet lassi, topped with a dusting of cardamom and slivered almonds. ${KEEP_COLD}` },
  { id: 'salty-lassi', ref: 'cold', prompt: `replace the drink with a white salted lassi (chaas), topped with roasted cumin and a small mint leaf. ${KEEP_COLD}` },
  { id: 'mango-shake', ref: 'cold', prompt: `replace the drink with a thick bright golden-yellow mango milkshake, topped with diced mango. ${KEEP_COLD}` },
  { id: 'rose-milk', ref: 'cold', prompt: `replace the drink with chilled soft-pink rose milk, topped with rose petals and chopped nuts. ${KEEP_COLD}` },
];

// Realistic product shots (no reference) for non-desi drinks.
const T2I = [
  { id: 'soft-drink', prompt: 'a chilled glass of dark cola soft drink with ice cubes and condensation, a plain unbranded silver soda can beside it, bright clean light neutral background, realistic product food photography, shallow depth of field, no text, no logo, square' },
  { id: 'water', prompt: 'a clear glass bottle of mineral water beside a tall glass of water with condensation droplets, bright clean white neutral background, realistic product photography, shallow depth of field, no text, no label, no logo, square' },
];

async function save(id, url) {
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(path.join(ROOT, 'public', 'menu', `${id}.jpg`), buf);
  console.log(`✓ ${id}  (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function edit(job) {
  const res = await fetch('https://fal.run/fal-ai/nano-banana/edit', {
    method: 'POST', headers: H,
    body: JSON.stringify({ prompt: job.prompt, image_urls: [REF[job.ref]], num_images: 1, output_format: 'jpeg' }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 160)}`);
  await save(job.id, (await res.json()).images[0].url);
}

async function t2i(job) {
  const res = await fetch('https://fal.run/fal-ai/nano-banana', {
    method: 'POST', headers: H,
    body: JSON.stringify({ prompt: job.prompt, num_images: 1, output_format: 'jpeg', aspect_ratio: '1:1' }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 160)}`);
  await save(job.id, (await res.json()).images[0].url);
}

const only = process.argv.slice(2);
const want = (id) => only.length === 0 || only.includes(id);
async function withRetry(fn, job) {
  for (let a = 0; a < 3; a++) {
    try { return await fn(job); }
    catch (e) { console.error(`  retry ${job.id} (${a + 1}): ${e.message}`); await new Promise((r) => setTimeout(r, 2500)); }
  }
  console.error(`✗ ${job.id}: gave up`);
}
for (const job of JOBS) if (want(job.id)) await withRetry(edit, job);
for (const job of T2I) if (want(job.id)) await withRetry(t2i, job);
console.log('drinks done.');
