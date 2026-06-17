import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

// O2 CDN 的 no-source-comment 检查器会对 React 静态导出 html 中的
// hydration 标记(<!--$-->、<!--/$-->)报错。这些是已解析态边界标记,
// 内容已完整,删除后仍能正常 hydrate。此脚本在 export 后清除 html 注释。
const OUT_DIR = "out"
const HTML_COMMENT = /<!--[\s\S]*?-->/g

function stripDir(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)

    if (statSync(path).isDirectory()) {
      stripDir(path)
    } else if (path.endsWith(".html")) {
      const original = readFileSync(path, "utf8")
      const stripped = original.replace(HTML_COMMENT, "")

      if (stripped !== original) {
        writeFileSync(path, stripped)
      }
    }
  }
}

stripDir(OUT_DIR)
console.log(`Stripped HTML comments under ${OUT_DIR}/`)
