// Turn the vetted official FAW-VW photos (assets-src/official/<slug>/<n>.jpg, downloaded per
// scripts/official-photos.json) into web-ready WebP files used by the model pages.
// Photos showing Chinese text (show plates, disclaimers, Chinese UI) were excluded on review.
// Usage: node scripts/process-official-photos.mjs
import { mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))

// n = source index (1..6). crop.bottom = fraction to cut from the bottom (removes a corner disclaimer).
const selection = {
  'talagon': [{ n: 6 }, { n: 2 }, { n: 3 }, { n: 5 }],
  'tayron': [{ n: 1 }, { n: 2 }, { n: 6 }, { n: 5 }],
  'magotan': [{ n: 1 }, { n: 3 }, { n: 4 }],
  'sagitar': [{ n: 3 }, { n: 1 }, { n: 2 }, { n: 4 }],
  'bora': [{ n: 5, crop: { bottom: 0.2 } }, { n: 4 }],
  'magotan-phev': [{ n: 3 }, { n: 5 }, { n: 6 }],
  'id-aura-t6': [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }],
}

let total = 0
for (const [slug, photos] of Object.entries(selection)) {
  const outDir = join(root, 'public/images/models', slug)
  await mkdir(outDir, { recursive: true })
  for (const p of photos) {
    const src = join(root, 'assets-src/official', slug, `${p.n}.jpg`)
    const out = join(outDir, `photo-${p.n}.webp`)
    let img = sharp(src)
    if (p.crop?.bottom) {
      const { width, height } = await img.metadata()
      img = sharp(src).extract({ left: 0, top: 0, width, height: Math.round(height * (1 - p.crop.bottom)) })
    }
    await img.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(out)
    const size = (await stat(out)).size
    total += size
    console.log(`${slug.padEnd(13)} photo-${p.n}.webp ${(size / 1024).toFixed(0).padStart(4)} KB`)
  }
}
console.log(`total ${(total / 1024 / 1024).toFixed(2)} MB`)
