import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "设计系统预览",
  description: "面向 AI 时代的 shadcn/ui 主题设计系统生成器。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
