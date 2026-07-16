/**
 * Generate photos for the Pizza & More menu (pizza, poutine, wings, pasta,
 * combos) via nano-banana text-to-image on fal.ai. These aren't desi dishes,
 * so we don't use the clay-bowl reference — just bright, appetising, realistic
 * food photography to match the rest of the menu cards.
 *
 *   node scripts/gen-pizza-photos.mjs           # missing only
 *   node scripts/gen-pizza-photos.mjs --force   # regenerate all
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

const STYLE =
  'Bright natural daylight, clean neutral light background, realistic appetising restaurant food photography, top three-quarter angle, square photo, sharp focus, no text, no watermark, no hands, no cutlery, no brand logos or labels.';

const ITEMS = [
  ['pizza-cheese', 'A whole cheese pizza with golden bubbling melted mozzarella on a hand-tossed crust'],
  ['pizza-3-toppings', 'A whole pizza topped with pepperoni, green bell peppers and black olives over melted cheese, hand-tossed crust'],
  ['pizza-5-toppings', 'A loaded supreme pizza with pepperoni, green peppers, black olives, red onions and mushrooms over melted cheese, hand-tossed crust'],
  ['pizza-chicken-paneer', 'A pizza topped with grilled tandoori chicken chunks, paneer cubes, green peppers and tomato over melted cheese, hand-tossed crust'],
  ['poutine', 'A bowl of Canadian poutine — crispy golden fries topped with white cheese curds and rich brown gravy'],
  ['butter-chicken-poutine', 'A bowl of butter chicken poutine — crispy fries topped with cheese curds, creamy orange butter-chicken sauce and tender chicken pieces, cilantro garnish'],
  ['chicken-wings', 'A plate of seven crispy golden fried chicken wings with a small bowl of dipping sauce'],
  ['rose-sauce-pasta', 'A bowl of creamy rosé-sauce penne pasta in a pink tomato-cream sauce, garnished with fresh herbs'],
  ['white-sauce-pasta', 'A bowl of creamy white-sauce macaroni pasta with melted cheese, garnished with parsley'],
  ['burger-combo', 'A fast-food combo: two stacked burgers, a side of fries and two plain unbranded soft-drink cans'],
  ['pizza-combo', 'A pizza combo: two medium pizzas, a side of fries and two plain unbranded soft-drink cans'],
  ['pizza-combo-deluxe', 'A deluxe combo: one medium pizza, a bowl of poutine, a plate of chicken wings and two plain unbranded soft-drink cans'],
];

async function genOne([file, desc], force) {
  const out = path.join(ROOT, 'public', 'menu', `${file}.jpg`);
  if (!force && fs.existsSync(out)) { console.log(`• skip ${file} (exists)`); return true; }
  const res = await fetch('https://fal.run/fal-ai/nano-banana', {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      prompt: `${desc}. ${STYLE}`,
      num_images: 1,
      output_format: 'jpeg',
      aspect_ratio: '1:1',
    }),
  });
  if (!res.ok) { console.error(`✗ ${file}: ${res.status} ${(await res.text()).slice(0, 200)}`); return false; }
  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) { console.error(`✗ ${file}: no image in response`); return false; }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`✓ ${file}  (${(buf.length / 1024).toFixed(0)} KB)`);
  return true;
}

async function main() {
  const force = process.argv.includes('--force');
  console.log(`Generating ${ITEMS.length} pizza-menu photo(s)…`);
  let ok = 0;
  for (const item of ITEMS) {
    try { if (await genOne(item, force)) ok++; } catch (e) { console.error(`✗ ${item[0]}:`, e.message); }
  }
  console.log(`done — ${ok}/${ITEMS.length}`);
}
main();
