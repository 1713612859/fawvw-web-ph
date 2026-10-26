// Convert the official studio side-profile photos (transparent PNG in assets-src/cutouts/)
// to WebP with alpha for the site: public/images/models/<slug>/card.webp
// Usage: node scripts/optimize-images.mjs
import { mkdir, readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { basename, join } from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const srcDir = join(root, 'assets-src/cutouts')
let before = 0
let after = 0
for (const file of (await readdir(srcDir)).filter((f) => f.endsWith('.png'))) {
  const slug = basename(file, '.png')
  const outDir = join(root, 'public/images/models', slug)
  await mkdir(outDir, { recursive: true })
  const src = join(srcDir, file)
  const out = join(outDir, 'card.webp')
  await sharp(src).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out)
  const [a, b] = [(await stat(src)).size, (await stat(out)).size]
  before += a
  after += b
  console.log(`${slug.padEnd(14)} ${(a / 1024).toFixed(0).padStart(5)} KB → ${(b / 1024).toFixed(0).padStart(4)} KB`)
}
console.log(`total          ${(before / 1024).toFixed(0).padStart(5)} KB → ${(after / 1024).toFixed(0).padStart(4)} KB`)
