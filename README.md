<div align="center">

# Design System Lab

**面向 AI 编码时代的设计系统生成器**

拨动一组种子参数，算法为你推导出一整套明暗双色、与 shadcn/ui 完全兼容的设计系统，
再一键编译成 AI 编码工具可以直接执行的工程指令。

</div>

---

> 当 AI 开始接管越来越多的编码工作，一个新问题浮现：你的设计系统，准备好被 AI “读懂”并严格遵循了吗？
>
> **Design System Lab** 给出的答案是——把设计品味沉淀为一条*可计算、可复现、可导出*的 token 链路。你在左侧拨动种子，右侧实时生长出完整的视觉系统；满意之后，把它编译成 CSS、JSON，或是一段能让 Codex / Cursor / Claude Code 直接落地的指令。

## 为什么需要它

- **设计系统应当机器可读。** 传统规范是给人阅读的文档，AI 难以严格消费；这里直接输出结构化、可执行的契约。
- **一致性来自算法，而非纪律。** 单一种子推导出整套 token，从色阶到明暗模式由算法保证一致，不再依赖手工维护。
- **弥合“设计”到“落地”的最后一公里。** 不止导出变量，更生成能让 AI 编码工具一步到位的指令。

## 核心理念：一条可计算的 Token 链路

```
  Seed Token  ──▶  算法 Map Token  ──▶  Semantic Token  ──▶  shadcn Adapter  ──▶  Preview
  种子参数         色阶 / 尺度生成        语义决策              兼容层               实时预览
```

- **算法层** — 用感知均匀的 OKLCH 色彩空间，把单一品牌色展开为完整色阶，并推导明暗两套刻度。
- **语义层** — 做产品决策：哪个刻度是主操作、哪个是次级表面、状态色如何取用。
- **适配层** — 把语义 token 映射到 shadcn/ui 的标准变量，任何 shadcn 组件即刻获得新主题。
- **预览层** — 实时渲染，所见即所得。

## 特性

- **七维种子控制** — 颜色、形状、密度、字体、材质、动效、Vibe（温度 / 表现力 / 领域 / 语气），覆盖一套设计系统的全部气质。
- **OKLCH 算法生成** — 从一个品牌色生成感知均匀的完整色阶，自动产出明暗两套语义 token。
- **三类实时预览** — 组件、区块（仪表盘 / 设置 / 认证 / 数据表 / AI 对话 / 定价）、美学（情绪 / 材质 / 字体 / 构图）。
- **六套领域预设** — 冷静 SaaS、技术工具、高级极简、AI 工作台、温暖内容、金融密集，一键起步。
- **AI 优先的导出** — 把设计系统编译为 AI 编码工具能直接消费的指令与契约，而不只是一堆变量。

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 启动开发服务器
```

打开 [http://localhost:3000](http://localhost:3000) 进入落地页，点击「打开主题实验室」即可进入 `/theme-lab` 开始调试。

其他命令：

```bash
npm run build      # 生产构建
npm run build:static # 生成可发布的静态产物到 out/
npm run typecheck  # TypeScript 类型检查
```

## 静态发布

项目已经配置为 Next.js 静态导出：

- `next.config.ts` 使用 `output: "export"`，构建产物输出到 `out/`
- `images.unoptimized: true`，避免静态导出时依赖 Next 图片服务
- `trailingSlash: true`，让 `/theme-lab/`、`/dashboard/` 等路由都生成目录式静态页面
- `postbuild` 会处理 `out/**/*.html`，删除 HTML 注释并把 `/_next/` 资源路径改成相对路径，便于部署到 CDN 子路径

生成静态产物：

```bash
npm run build:static
```

发布时把 `out/` 目录上传到任意静态托管服务即可。Vercel 已配置为使用 `out/`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out"
}
```

## 工作流

1. **起步** — 选择一套内置预设，或从默认种子开始。
2. **调参** — 在左侧面板拨动种子，右侧预览实时更新；随时切换明暗、切换组件 / 区块 / 美学视图。
3. **导出** — 满意后，把设计系统复制为 CSS、JSON，或一段可执行的 AI 指令，落地到你的项目。

## 导出产物

| 产物 | 用途 |
| --- | --- |
| **global CSS block** | `:root` 与 `.dark` 的 CSS 变量，可直接粘贴进 `globals.css` |
| **theme-lab.json** | 完整配置清单（manifest），供工具链消费 |
| **theme.preset.json** | 种子预设，便于复现与分享 |
| **vibe.json** | 风格描述符：关键词、视觉语言与 AI prompt |
| **theme.algorithm.ts** | 生成算法的 TypeScript 源码 |
| **AGENTS 区块** | 可写入 `AGENTS.md` 的主题规则 |
| **导入到项目** | 面向 Codex / Cursor / Claude Code 的可执行指令，含「一次性优化页面」与「长期项目契约」两种模式 |

## 项目结构

```
app/
  page.tsx               落地页
  theme-lab/             主应用（主题实验室）
  dashboard/             shadcn 仪表盘示例
  globals.css            Tailwind 与主题集成
lib/theme/
  schema.ts              种子与 token 的类型定义
  defaults.ts            默认种子
  presets.ts             六套内置预设
  derive-theme.ts        主流程编排
  algorithms/            颜色 / 字体 / 圆角 / 密度 / 材质 / 动效 算法
  semantic.ts            语义 token 映射（明 / 暗）
  shadcn-adapter.ts      shadcn 兼容层
  vibe.ts                Vibe 描述符生成
  export-*.ts            CSS / JSON / prompt / AGENTS / 算法 导出
components/theme-lab/
  theme-lab-shell.tsx    顶层布局与状态
  seed-control-panel.tsx 种子控制面板
  preview-*.tsx          预览框架 / 画布 / 标签
  previews/              组件 / 区块 / 美学 三类预览
  export-panel.tsx       导出面板
components/ui/            shadcn/ui 基础组件
```

## 技术栈

- **框架** — Next.js 16（App Router）· React 19 · TypeScript
- **样式** — Tailwind CSS v4 · shadcn/ui · Radix UI
- **预览与交互** — Recharts · TanStack Table · dnd-kit · assistant-ui · Sonner · Lucide
- **工具** — Zod · date-fns

## 贡献者

- **Gus**
- **Alibaba**
