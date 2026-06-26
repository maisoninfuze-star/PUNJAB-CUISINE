/**
 * Generate ultra-realistic editorial imagery with fal.ai (FLUX) and save them
 * into /public. Run:  node scripts/gen-images.mjs [only-slug]
 *
 * Reads FAL_KEY from env or ../shared-keys/fal.env.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Resolve FAL_KEY ─────────────────────────────────────────────
let FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  const envPath = path.resolve(ROOT, '../shared-keys/fal.env');
  if (fs.existsSync(envPath)) {
    const m = fs.readFileSync(envPath, 'utf8').match(/^FAL_KEY=(.+)$/m);
    if (m) FAL_KEY = m[1].trim();
  }
}
if (!FAL_KEY || FAL_KEY === '<set>') {
  console.error('✗ FAL_KEY not found. Set env or shared-keys/fal.env');
  process.exit(1);
}

const STYLE =
  'ultra realistic editorial food photography, fine dining plating, warm cinematic golden lighting, deep dark moody charcoal background, shallow depth of field, gentle steam rising, rich saffron and gold tones, Michelin-star presentation, shot on 85mm f1.4, photographic, high detail, no text, no watermark';

const AMBIANCE =
  'ultra realistic editorial interior photography, luxury modern Punjabi fine-dining restaurant, warm amber ambient lighting, brass and dark wood, candle glow, moody cinematic, shallow depth of field, no text, no people in focus';

// slug, prompt, aspect (square_hd | landscape_16_9 | portrait_4_3), dir
const JOBS = [
  // Hero + story (wide)
  ['hero/hero-dish', `a luxurious bowl of butter chicken murgh makhani garnished with cream and coriander, copper bowl, ${STYLE}`, 'landscape_16_9'],
  ['story/heritage', `hands of a chef pressing fresh naan dough beside a glowing clay tandoor oven, flour dust in warm light, ${AMBIANCE}`, 'landscape_16_9'],
  ['story/interior', AMBIANCE, 'landscape_16_9'],
  ['story/spices', `overhead arrangement of vibrant Indian spices, saffron, cardamom, dried red chillies, turmeric and star anise in small brass bowls on dark slate, ${STYLE}`, 'landscape_16_9'],
  ['og', `elegant overhead spread of assorted Punjabi dishes, butter chicken, naan, dal makhani, candlelight, ${STYLE}`, 'landscape_16_9'],

  // Menu — square
  ['menu/dal-makhani', `creamy black lentil dal makhani in a rustic copper karahi, swirl of cream, ${STYLE}`, 'square_hd'],
  ['menu/sarson-saag', `sarson da saag mustard greens curry topped with white butter, served with makki di roti, ${STYLE}`, 'square_hd'],
  ['menu/paneer-tikka', `chargrilled paneer tikka skewers with peppers and onion, char marks, mint chutney, ${STYLE}`, 'square_hd'],
  ['menu/shahi-paneer', `shahi paneer in rich creamy cashew saffron gravy, garnished with slivered almonds, ${STYLE}`, 'square_hd'],
  ['menu/chana-masala', `chana masala chickpea curry in a dark bowl, fresh coriander and ginger julienne, ${STYLE}`, 'square_hd'],
  ['menu/malai-kofta', `malai kofta dumplings in velvety almond cream sauce, gold leaf garnish, ${STYLE}`, 'square_hd'],
  ['menu/butter-chicken', `butter chicken murgh makhani, tandoori chicken pieces in silky tomato gravy, copper bowl, ${STYLE}`, 'square_hd'],
  ['menu/chicken-tikka-masala', `chicken tikka masala, charred chicken in spiced creamy onion gravy, ${STYLE}`, 'square_hd'],
  ['menu/tandoori-chicken', `tandoori chicken legs lacquered red with char, lemon and onion rings on a sizzling platter, ${STYLE}`, 'square_hd'],
  ['menu/amritsari-chicken', `home-style Amritsari chicken curry, bone-in, thick masala, fresh coriander, ${STYLE}`, 'square_hd'],
  ['menu/rogan-josh', `lamb rogan josh, tender lamb in fragrant deep red Kashmiri gravy, ${STYLE}`, 'square_hd'],
  ['menu/keema-matar', `keema matar minced lamb with green peas, whole spices, in a dark bowl, ${STYLE}`, 'square_hd'],
  ['menu/lamb-korma', `lamb korma in pale golden nut gravy scented with cardamom, slivered pistachio, ${STYLE}`, 'square_hd'],
  ['menu/amritsari-fish', `Amritsari fish, golden gram-flour battered fried fish with chaat masala and lemon, ${STYLE}`, 'square_hd'],
  ['menu/tandoori-prawns', `tandoori tiger prawns with saffron yogurt marinade and char, lime, ${STYLE}`, 'square_hd'],
  ['menu/fish-masala', `Punjabi fish masala, seared fillets in coriander rich onion tomato gravy, ${STYLE}`, 'square_hd'],
  ['menu/gulab-jamun', `warm gulab jamun milk dumplings in saffron rose syrup, dusted pistachio, ${STYLE}`, 'square_hd'],
  ['menu/gajar-halwa', `gajar ka halwa red carrot pudding with ghee and pistachio in a brass bowl, ${STYLE}`, 'square_hd'],
  ['menu/kulfi', `pistachio saffron kulfi on falooda, sliced, garnished with rose petals, ${STYLE}`, 'square_hd'],
  ['menu/mango-lassi', `mango lassi in a tall glass, thick and creamy, cardamom dust, mango slice, ${STYLE}`, 'square_hd'],
  ['menu/masala-chai', `masala chai in a glass cup with steam, cinnamon and star anise, warm light, ${STYLE}`, 'square_hd'],
  ['menu/thandai', `royal thandai chilled almond rose milk in an ornate glass, saffron and rose petals, ${STYLE}`, 'square_hd'],
];

const only = process.argv[2];

async function generate(slug, prompt, aspect) {
  const out = path.join(ROOT, 'public', `${slug}.jpg`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out)) {
    console.log(`• skip ${slug} (exists)`);
    return;
  }
  const res = await fetch('https://fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: aspect,
      num_inference_steps: 32,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: false,
    }),
  });
  if (!res.ok) {
    console.error(`✗ ${slug}: ${res.status} ${await res.text()}`);
    return;
  }
  const data = await res.json();
  const url = data?.images?.[0]?.url;
  if (!url) {
    console.error(`✗ ${slug}: no image in response`);
    return;
  }
  const img = await fetch(url);
  const buf = Buffer.from(await img.arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`✓ ${slug}  (${(buf.length / 1024).toFixed(0)} KB)`);
}

for (const [slug, prompt, aspect] of JOBS) {
  if (only && !slug.includes(only)) continue;
  try {
    await generate(slug, prompt, aspect);
  } catch (e) {
    console.error(`✗ ${slug}:`, e.message);
  }
}
console.log('done.');
