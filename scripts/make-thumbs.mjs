// Small gallery thumbnails (240 px wide) from the web photos, so the thumbnail strip
// doesn't download every full-size photo. Works from files in the repo (no originals needed).
// Usage: node scripts/make-thumbs.mjs   → public/images/models/<slug>/photo-<n>-thumb.webp
import { readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../public/images/models', import.meta.url))
let total = 0
for (const slug of await readdir(root)) {
  const dir = join(root, slug)
  for (const file of (await readdir(dir)).filter((f) => /^photo-\d+\.webp$/.test(f))) {
    const out = join(dir, file.replace('.webp', '-thumb.webp'))
    await sharp(join(dir, file)).resize({ width: 240 }).webp({ quality: 70 }).toFile(out)
    const size = (await stat(out)).size
    total += size
    console.log(`${slug.padEnd(13)} ${file.replace('.webp', '-thumb.webp').padEnd(20)} ${(size / 1024).toFixed(1)} KB`)
  }
}
console.log(`total ${(total / 1024).toFixed(0)} KB`)
