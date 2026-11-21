// Download the fawcar.com CDN images listed in app/data/fawcar/<slug>.json into
// assets-src/fawcar/<slug>/ (originals, not committed: the repo is public).
// Only www-cdn.fawcar.com URLs are fetched. The feature photos under www.fawcar.com/file_cos/
// refuse scripted downloads, so they are skipped and listed at the end.
// Usage: node scripts/fetch-fawcar-images.mjs
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { extname, join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const dataDir = join(root, 'app/data/fawcar')
const outRoot = join(root, 'assets-src/fawcar')

const exists = (p) => stat(p).then(() => true, () => false)
const skipped = []
let fetched = 0

for (const file of (await readdir(dataDir)).filter((f) => f.endsWith('.json'))) {
  const slug = file.replace('.json', '')
  const d = JSON.parse(await readFile(join(dataDir, file), 'utf8'))
  // name → url. Names are stable so app/data/media.ts can refer to them.
  const list = {
    main: d.images.main,
    carousel: d.images.carousel,
    small: d.images.small,
    small2: d.images.small2,
    hero: d.images.hero,
    ...Object.fromEntries(d.images.bigImgs.map((u, i) => [`big-${i + 1}`, u])),
    ...Object.fromEntries(d.appearance.colors.map((c, i) => [`ext-${i + 1}`, c.img])),
    ...Object.fromEntries(d.interior.colors.map((c, i) => [`int-${i + 1}`, c.img])),
  }
  for (const s of d.sections) for (const it of s.items) if (it.img) skipped.push(`${slug}: ${it.img}`)

  const dir = join(outRoot, slug)
  await mkdir(dir, { recursive: true })
  for (const [name, url] of Object.entries(list)) {
    if (!url || !url.startsWith('https://www-cdn.fawcar.com/')) continue
    const ext = extname(new URL(url).pathname).replace('.jpeg', '.jpg') || '.jpg'
    const out = join(dir, name + ext)
    if (await exists(out)) continue
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`${slug} ${name}: HTTP ${res.status}`)
      continue
    }
    await writeFile(out, Buffer.from(await res.arrayBuffer()))
    fetched++
    console.log(`${slug.padEnd(15)} ${(name + ext).padEnd(12)} ${((await stat(out)).size / 1024).toFixed(0).padStart(5)} KB`)
  }
}
// News covers (only the ones on the CDN; the others are on file_cos too).
const newsCovers = {
  'ph-launch': 'https://www-cdn.fawcar.com/global/prod-public-singapore/d639822581cc4162a0d37031fa5b1442.png',
}
await mkdir(join(outRoot, 'news'), { recursive: true })
for (const [name, url] of Object.entries(newsCovers)) {
  const out = join(outRoot, 'news', name + extname(new URL(url).pathname))
  if (await exists(out)) continue
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`news ${name}: HTTP ${res.status}`)
    continue
  }
  await writeFile(out, Buffer.from(await res.arrayBuffer()))
  fetched++
  console.log(`news            ${name}`)
}

console.log(`\nfetched ${fetched} files into assets-src/fawcar/`)
console.log(`skipped ${skipped.length} feature photos on www.fawcar.com/file_cos (not downloadable by script)`)
