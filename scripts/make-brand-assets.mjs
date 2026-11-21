// Logo and favicons from the official FAWCAR artwork ("鹰标+fawcar.zip" from the client:
// 海外版横式标识 彩/白 = horizontal logo, colour/white). Copy those PNGs to
// assets-src/brand/horizontal-color.png and horizontal-white.png (not committed), then run:
//   node scripts/make-brand-assets.mjs
// Output: public/images/brand/fawcar-logo{,-white}.webp (eagle mark + FAWCAR wordmark),
//         public/favicon.png and public/apple-touch-icon.png (eagle mark only).
import { mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = (f) => join(root, 'assets-src/brand', f)
const outDir = join(root, 'public/images/brand')
await mkdir(outDir, { recursive: true })

async function report(file) {
  const { width, height } = await sharp(file).metadata()
  console.log(`${file.replace(root, '').padEnd(40)} ${width}×${height} ${((await stat(file)).size / 1024).toFixed(1)} KB`)
}

// Horizontal logo, 120 px tall (3× a 40 px header logo).
for (const [from, to] of [['horizontal-color.png', 'fawcar-logo.webp'], ['horizontal-white.png', 'fawcar-logo-white.webp']]) {
  const out = join(outDir, to)
  await sharp(src(from)).resize({ height: 120 }).webp({ lossless: true, effort: 6 }).toFile(out)
  await report(out)
}

// Eagle mark: the oval on the left of the horizontal logo (the first run of opaque columns).
const { data, info } = await sharp(src('horizontal-color.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const opaque = (x) => {
  for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] > 16) return true
  return false
}
let left = 0
while (!opaque(left)) left++
let right = left
while (opaque(right + 1)) right++
const mark = await sharp(src('horizontal-color.png'))
  .extract({ left, top: 0, width: right - left + 1, height: info.height })
  .trim()
  .png()
  .toBuffer()

const square = async (size, pad, background) => {
  const inner = Math.round(size * (1 - pad * 2))
  const fitted = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background } }).composite([{ input: fitted, gravity: 'center' }])
}
await (await square(96, 0.02, { r: 0, g: 0, b: 0, alpha: 0 })).png({ compressionLevel: 9 }).toFile(join(root, 'public/favicon.png'))
await report(join(root, 'public/favicon.png'))
await (await square(180, 0.1, { r: 255, g: 255, b: 255, alpha: 1 })).png({ compressionLevel: 9 }).toFile(join(root, 'public/apple-touch-icon.png'))
await report(join(root, 'public/apple-touch-icon.png'))
