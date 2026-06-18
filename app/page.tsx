export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--status-info-bg) 92%, var(--background)) 0%, color-mix(in oklch, var(--primary) 18%, var(--background)) 26%, color-mix(in oklch, var(--status-danger-bg) 24%, var(--background)) 46%, color-mix(in oklch, var(--status-warning-bg) 18%, var(--background)) 66%, var(--background) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 8%, color-mix(in oklch, var(--status-info) 22%, transparent), transparent 32%), radial-gradient(circle at 48% 4%, color-mix(in oklch, var(--primary) 24%, transparent), transparent 38%), radial-gradient(circle at 84% 8%, color-mix(in oklch, var(--status-danger) 13%, transparent), transparent 34%), radial-gradient(circle at 70% 36%, color-mix(in oklch, var(--status-warning) 12%, transparent), transparent 36%), linear-gradient(180deg, transparent 0%, transparent 48%, color-mix(in oklch, var(--background) 36%, transparent) 72%, var(--background) 100%)",
        }}
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col items-center justify-center px-8 py-10 text-center sm:px-14 lg:px-20">
        <div className="max-w-[980px]">
          <p className="text-sm font-medium text-muted-foreground">
            主题实验室
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
            面向 AI 时代的设计系统生成器
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground">
            调整Token参数，定制视觉系统，并快速在您的项目中应用
          </p>
          <a
            className="mt-8 inline-flex h-[var(--control-height-lg)] w-fit items-center rounded-[var(--radius-control)] bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            href="./theme-lab/"
          >
            打开主题实验室
          </a>
        </div>
      </section>
    </main>
  )
}
