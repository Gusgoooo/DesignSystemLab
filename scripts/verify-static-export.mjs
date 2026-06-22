import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs"
import { dirname, join, relative, resolve } from "node:path"

const OUT_DIR = resolve("out")
const attrPattern = /(?:href|src)="([^"]+)"/g
const localAssetPattern = /\.(?:css|js|html|png|jpg|jpeg|webp|svg|ico)$/i

function fail(message, details = []) {
  console.error(`Static export verification failed: ${message}`)

  for (const detail of details) {
    console.error(`- ${detail}`)
  }

  process.exit(1)
}

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)

    if (statSync(path).isDirectory()) {
      walkHtml(path, files)
    } else if (path.endsWith(".html")) {
      files.push(path)
    }
  }

  return files
}

function walkFiles(dir, matcher, files = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)

    if (statSync(path).isDirectory()) {
      walkFiles(path, matcher, files)
    } else if (matcher(path)) {
      files.push(path)
    }
  }

  return files
}

function isExternalRef(value) {
  return /^(?:https?:|mailto:|tel:|data:|blob:|#|javascript:)/i.test(value)
}

function cleanRef(value) {
  return value.split("#")[0].split("?")[0]
}

if (!existsSync(OUT_DIR)) {
  fail("out/ does not exist. Run `npm run build:static` first.")
}

const indexPath = join(OUT_DIR, "index.html")
const themeLabPath = join(OUT_DIR, "theme-lab", "index.html")

for (const requiredPath of [indexPath, themeLabPath]) {
  if (!existsSync(requiredPath)) {
    fail(`missing required page ${relative(OUT_DIR, requiredPath)}`)
  }
}

const indexHtml = readFileSync(indexPath, "utf8")
const themeLabHtml = readFileSync(themeLabPath, "utf8")

if (!indexHtml.includes('href="./theme-lab/"')) {
  fail("home entry does not use the relative theme-lab directory URL")
}

if (!themeLabHtml.includes("self.__next_f.push")) {
  fail("theme-lab page is missing Next flight bootstrap data")
}

if (!themeLabHtml.includes("<!--")) {
  fail(
    "theme-lab page is missing React hydration comments",
    [
      "Do not strip HTML comments from exported Next pages.",
      "React uses these comment nodes to hydrate Client Components correctly.",
    ]
  )
}

const htmlFiles = walkHtml(OUT_DIR)
const rootRefs = []
const missingRefs = []

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8")
  let match

  while ((match = attrPattern.exec(html))) {
    const value = match[1]

    if (isExternalRef(value)) {
      continue
    }

    if (value.startsWith("/")) {
      rootRefs.push(`${relative(OUT_DIR, file)} -> ${value}`)
      continue
    }

    const cleaned = cleanRef(value)

    if (!localAssetPattern.test(cleaned)) {
      continue
    }

    const target = resolve(dirname(file), cleaned)

    if (!target.startsWith(OUT_DIR) || !existsSync(target)) {
      missingRefs.push(
        `${relative(OUT_DIR, file)} -> ${value} -> ${relative(OUT_DIR, target)}`
      )
    }
  }
}

if (rootRefs.length > 0) {
  fail("found root-relative href/src refs that break CDN subdirectory deploys", rootRefs)
}

if (missingRefs.length > 0) {
  fail("found href/src refs that do not resolve inside out/", missingRefs)
}

const webpackRuntimeFiles = walkFiles(
  join(OUT_DIR, "_next", "static", "chunks"),
  (path) => /\/webpack-[^/]+\.js$/.test(path)
)
const fixedRootPublicPath = []

for (const file of webpackRuntimeFiles) {
  const js = readFileSync(file, "utf8")

  if (/\.p="\/_next\/"/.test(js)) {
    fixedRootPublicPath.push(relative(OUT_DIR, file))
  }
}

if (fixedRootPublicPath.length > 0) {
  fail("found fixed root webpack publicPath values", fixedRootPublicPath)
}

console.log(
  `Verified static export: ${htmlFiles.length} HTML files, relative assets, hydration markers, and home entry are OK`
)
