import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center gap-6">
        <p className="text-sm font-medium text-muted-foreground">主题实验室</p>
        <h1 className="text-4xl font-semibold tracking-tight">
          面向 AI 时代的设计系统生成器
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          调整 seed token，预览自动生成的语义 token，并导出兼容
          shadcn 的主题产物。
        </p>
        <Link
          className="inline-flex h-[var(--control-height-md)] w-fit items-center rounded-[var(--radius-control)] bg-primary px-4 text-sm font-medium text-primary-foreground"
          href="/theme-lab"
        >
          打开主题实验室
        </Link>
      </div>
    </main>
  )
}
