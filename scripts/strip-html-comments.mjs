import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, relative, sep } from "node:path"

// O2 CDN 发布后处理(导出后对 out/ 的 html 执行):
// 1) 删除 html 注释(React 的 <!--$--> / <!--/$--> hydration 标记),
//    通过 O2 的 no-source-comment 检查。
// 2) 把根绝对资源路径 "/_next/ 改为相对路径,适配 CDN 子路径部署。
//    资源与 html 同在发布版本目录下,相对引用不依赖 assetPrefix / publicPath
//    的注入(配合 trailingSlash 时各层级深度自动计算前缀)。
const OUT_DIR = "out"
const HTML_COMMENT = /<!--[\s\S]*?-->/g

function processHtml(path) {
  const relDir = relative(OUT_DIR, dirname(path))
  const depth = relDir === "" ? 0 : relDir.split(sep).length
  const prefix = depth === 0 ? "./" : "../".repeat(depth)

  let html = readFileSync(path, "utf8")
  html = html.replace(HTML_COMMENT, "")
  html = html.replace(/(["(])\/_next\//g, `$1${prefix}_next/`)
  writeFileSync(path, html)
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)

    if (statSync(path).isDirectory()) {
      walk(path)
    } else if (path.endsWith(".html")) {
      processHtml(path)
    }
  }
}

walk(OUT_DIR)
console.log("Post-processed out/: stripped html comments + relativized /_next/ paths")
