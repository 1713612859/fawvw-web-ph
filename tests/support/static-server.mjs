// Minimal static file server for the generated site, behaving like a typical static host:
// /path → /path/index.html, unknown paths → 404.html with HTTP 404.
// Usage: node tests/support/static-server.mjs .output/public 3211
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve(process.argv[2] ?? '.output/public')
const port = Number(process.argv[3] ?? 3211)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

async function resolveFile(p) {
  try {
    const s = await stat(p)
    return s.isDirectory() ? resolveFile(join(p, 'index.html')) : p
  }
  catch {
    return null
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost')
  const rel = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '')
  let file = await resolveFile(join(root, rel))
  if (file && !(file === root || file.startsWith(root + sep))) file = null
  let status = 200
  if (!file) {
    file = join(root, '404.html')
    status = 404
  }
  const body = await readFile(file)
  res.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  res.end(req.method === 'HEAD' ? undefined : body)
}).listen(port, () => console.log(`static site on http://localhost:${port}`))
