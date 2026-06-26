/**
 * Generate a cinematic, scroll-scrubbable hero clip with fal.ai:
 *   1. FLUX renders a wide cinematic source still  -> public/hero/hero-poster.jpg
 *   2. image-to-video animates a slow dolly push-in -> public/hero/hero.mp4
 *
 * Run: node scripts/gen-hero-video.mjs
 * Reads FAL_KEY from env or ../shared-keys/fal.env.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  const envPath = path.resolve(ROOT, '../shared-keys/fal.env');
  if (fs.existsSync(envPath)) {
    const m = fs.readFileSync(envPath, 'utf8').match(/^FAL_KEY=(.+)$/m);
    if (m) FAL_KEY = m[1].trim();
  }
}
if (!FAL_KEY || FAL_KEY === '<set>') {
  console.error('FAL_KEY missing');
  process.exit(1);
}
const H = { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' };

const SOURCE_PROMPT =
  'cinematic editorial hero still, macro close-up of golden saffron threads, whole star anise, green cardamom and dried red chillies suspended over a glowing clay tandoor, drifting warm steam and floating embers, deep charcoal black background, volumetric warm golden light, shallow depth of field, luxury fine-dining mood, warm cinematic color grade, shot on 85mm f1.4, ultra realistic, no text';

const MOTION_PROMPT =
  'slow cinematic dolly push-in toward the spices, gentle rising steam, glowing embers drifting upward, subtle shimmering golden light, smooth slow-motion, cinematic, no text';

async function flux() {
  console.log('1/3  rendering source still (FLUX)…');
  const res = await fetch('https://fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: H,
    body: JSON.stringify({
      prompt: SOURCE_PROMPT,
      image_size: 'landscape_16_9',
      num_inference_steps: 34,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: false,
    }),
  });
  if (!res.ok) throw new Error(`flux ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const url = data.images[0].url;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  fs.mkdirSync(path.join(ROOT, 'public/hero'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'public/hero/hero-poster.jpg'), buf);
  console.log(`     poster saved (${(buf.length / 1024).toFixed(0)} KB)`);
  return url;
}

// Try a sequence of image-to-video models until one succeeds.
const MODELS = [
  {
    id: 'fal-ai/kling-video/v1.6/standard/image-to-video',
    body: (image_url) => ({ prompt: MOTION_PROMPT, image_url, duration: '5', aspect_ratio: '16:9' }),
  },
  {
    id: 'fal-ai/wan-i2v',
    body: (image_url) => ({ prompt: MOTION_PROMPT, image_url, num_frames: 81, resolution: '720p' }),
  },
  {
    id: 'fal-ai/ltx-video/image-to-video',
    body: (image_url) => ({ prompt: MOTION_PROMPT, image_url }),
  },
];

async function submit(model, image_url) {
  const res = await fetch(`https://queue.fal.run/${model.id}`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify(model.body(image_url)),
  });
  if (!res.ok) throw new Error(`submit ${res.status}: ${await res.text()}`);
  return (await res.json()).request_id;
}

async function poll(modelId, id) {
  const base = `https://queue.fal.run/${modelId}/requests/${id}`;
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 4000));
    const s = await (await fetch(`${base}/status`, { headers: H })).json();
    process.stdout.write(`     ${s.status}\r`);
    if (s.status === 'COMPLETED') {
      const out = await (await fetch(base, { headers: H })).json();
      return out?.video?.url || out?.video || out?.url;
    }
    if (s.status === 'FAILED' || s.status === 'ERROR') throw new Error('job failed');
  }
  throw new Error('timeout');
}

async function main() {
  const imageUrl = await flux();
  for (const model of MODELS) {
    try {
      console.log(`2/3  animating via ${model.id} …`);
      const id = await submit(model, imageUrl);
      const videoUrl = await poll(model.id, id);
      if (!videoUrl) throw new Error('no video url');
      console.log(`\n3/3  downloading clip…`);
      const buf = Buffer.from(await (await fetch(videoUrl)).arrayBuffer());
      fs.writeFileSync(path.join(ROOT, 'public/hero/hero.mp4'), buf);
      console.log(`done — hero.mp4 (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
      return;
    } catch (e) {
      console.warn(`     ${model.id} failed: ${e.message}; trying next…`);
    }
  }
  console.error('all video models failed — poster still saved.');
  process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
