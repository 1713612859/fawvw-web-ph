// Turn the fawcar.com originals (assets-src/fawcar/<slug>/, fetched by
// scripts/fetch-fawcar-images.mjs) into the WebP files the site uses:
//   public/images/models/<slug>/card.webp            side cut-out with alpha (cards, menus, studio view)
//   public/images/models/<slug>/hero.webp            full-screen scene photo (+ hero-thumb.webp)
//   public/images/models/<slug>/scene-<n>.webp       extra exterior scenes, from big-<n> (+ -thumb)
//   public/images/models/<slug>/interior-<n>.webp    interior photos, from int-<n> (+ -thumb)
//   public/images/models/<slug>/color-<n>.webp       exterior colour cut-outs with alpha, from ext-<n>
//   public/images/news/<name>.webp                   news covers, from assets-src/fawcar/news/
// main/carousel are not used: on fawcar.com they are the same picture as hero.
// All photos were reviewed: none shows Chinese text.
// Usage: node scripts/process-fawcar-photos.mjs
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const srcRoot = join(root, 'assets-src/fawcar')
const outRoot = join(root, 'public/images/models')

// Colour cut-outs left out because they look the same as another one.
const skip = { 'bestune-xiaoma': ['ext-3'] }

let total = 0
async function write(img, out) {
  await img.toFile(out)
  total += (await stat(out)).size
}
const photo = (src, width) => sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 72, effort: 6 })
const thumb = (src) => sharp(src).resize({ width: 240 }).webp({ quality: 70 })

for (const slug of (await readdir(srcRoot)).sort()) {
  if (slug === 'news') continue
  const srcDir = join(srcRoot, slug)
  const outDir = join(outRoot, slug)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const files = (await readdir(srcDir)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
  const made = []
  for (const file of files) {
    const { name } = parse(file)
    const src = join(srcDir, file)
    if (skip[slug]?.includes(name)) continue
    let m
    if (name === 'small2') {
      await write(sharp(src).webp({ quality: 82, alphaQuality: 90, effort: 6 }), join(outDir, 'card.webp'))
      made.push('card')
    } else if (name === 'hero') {
      await write(photo(src, 1920), join(outDir, 'hero.webp'))
      await write(thumb(src), join(outDir, 'hero-thumb.webp'))
      made.push('hero')
    } else if ((m = name.match(/^(big|int)-(\d+)$/))) {
      const out = `${m[1] === 'big' ? 'scene' : 'interior'}-${m[2]}`
      await write(photo(src, 1600), join(outDir, `${out}.webp`))
      await write(thumb(src), join(outDir, `${out}-thumb.webp`))
      made.push(out)
    } else if ((m = name.match(/^ext-(\d+)$/))) {
      await write(sharp(src).webp({ quality: 80, alphaQuality: 90, effort: 6 }), join(outDir, `color-${m[1]}.webp`))
      made.push(`color-${m[1]}`)
    }
  }
  console.log(`${slug.padEnd(15)} ${made.join(' ')}`)
}
// News covers → public/images/news/<name>.webp
const newsDir = join(root, 'public/images/news')
await mkdir(newsDir, { recursive: true })
for (const file of await readdir(join(srcRoot, 'news')).catch(() => [])) {
  const { name } = parse(file)
  await write(photo(join(srcRoot, 'news', file), 1600), join(newsDir, `${name}.webp`))
  console.log(`news            ${name}`)
}
console.log(`total ${(total / 1024 / 1024).toFixed(2)} MB`)
