import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Visual System Lab",
  description: "面向 AI 时代的视觉设计系统生成器。",
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
