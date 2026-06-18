<div align="center">

# Design System Lab

**面向 AI 编码时代的 design harness**

不是又一个主题生成器——而是给「AI 生成 UI」套上的一层确定性约束。
AI 提供生成力，Design System Lab 提供确定性：把一套设计系统编译成 AI 能直接执行、并长期遵守的契约，让任意强度的模型都收敛到同一个系统。

</div>

---

用 AI 写界面，最先解决的是「好看」，最难解决的是「统一」。给它一段描述，几秒钟就能换来一个体面的页面；可几十个这样的页面分散在不同的人、不同的时间、不同的措辞里生成，每一个单独看都成立，凑在一起却开始互相矛盾——主色偏移，状态色不一，圆角与间距各执一词。没有谁犯了错，可那个本该贯穿始终的「系统」消失了。

把规范写进提示词、让模型遵守，在单次对话里有效，放到时间线上就会漏：模型每一次生成都是重新推理一遍，带着采样的偶然，并随版本、上下文、措辞悄悄漂移，你没法让一个本质上概率化的系统在三个月后复现同一个决定。Design System Lab 换了个思路——不向模型要确定性，而是把它固化成模型之外、能被反复精确调用的工件：一个 `seed → tokens` 的纯函数。给定一组种子，算法用感知均匀的 OKLCH 推导出整套明暗 token，同一组种子永远导出同一套结果，可复现、可审计、可版本化。模型不再负责记住规则，只负责消费这份已经定下来的结果，并把它编译成 CSS 变量、JSON，以及一段能写进 `CLAUDE.md` / `AGENTS.md`、让 Codex / Cursor / Claude Code 长期遵守的契约。

这就是 **design harness**。我不和模型比谁更会生成，那是它的天赋；我只规定它把这份天赋使在哪个方向上。模型越强、能生成的越多越杂，就越需要有东西把这些可能性收回到同一套系统里，否则得到的只是更高级的不一致。所以这套约束的价值，是随模型变强而上涨的，不会被抹平。

> 更完整的展开——使用说明、解决的痛点、对比与愿景——在应用内：启动后进入 `/theme-lab`，点右上角的「说明」。

## 核心理念：一条可计算的确定性 Token 链路

```
  Seed Token  ──▶  算法 Map Token  ──▶  Semantic Token  ──▶  shadcn Adapter  ──▶  Preview
  种子参数         色阶 / 尺度生成        语义决策              兼容层               实时预览
```

这条链路就是整套约束的着力点：把设计系统的确定性从模型里取出来，固化成一个可以被反复精确调用的源。

算法层用感知均匀的 OKLCH，把单一品牌色展开成完整色阶、推导明暗两套刻度；语义层接着做产品决策——哪个刻度是主操作、哪个是次级表面、状态色与图表色如何取用。再往后，适配层把语义 token 映射到 shadcn/ui 的标准 CSS 变量，任何 shadcn 组件即刻换上新主题；而因为产物是 CSS 变量 + Tailwind v4 `@theme`，这套系统不绑运行时，可移植到任意 Tailwind 项目（v3 用 `var()` 兜底）。最后是预览层，实时渲染、所见即所得。

## 特性

- **七维种子控制** — 颜色、形状、密度、字体、材质、动效、Vibe（温度 / 表现力 / 领域 / 语气），覆盖一套设计系统的全部气质。
- **OKLCH 算法生成** — 从一个品牌色生成感知均匀的完整色阶，自动产出明暗两套语义 token，对比度可控、跨态协调。
- **两类实时预览** — 组件级（按钮 / 表单 / 徽章 / 表格 / 图表 …）与模块级（仪表盘 / 设置 / 认证 / 数据表 / AI 对话 / 定价）。
- **九套场景预设** — AI、SaaS、后台、金融、内容、客服、电商、营销、开发，一键起步。
- **面向 AI 的契约导出** — 导出的不是一堆变量，而是 AI 编码工具能直接消费、并长期执行的指令与契约。

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
2. **调参** — 在左侧面板拨动种子，右侧预览实时更新；随时切换明暗、切换组件 / 模块视图。
3. **导出** — 满意后，把设计系统复制为 CSS、JSON，或一段可执行的 AI 契约，落地到你的项目。

## 导出产物

| 产物 | 用途 |
| --- | --- |
| **global CSS block** | `:root` 与 `.dark` 的 CSS 变量，可直接粘贴进 `globals.css` |
| **theme-lab.json** | 完整配置清单（manifest），供工具链消费 |
| **theme.preset.json** | 种子预设，便于复现与分享 |
| **vibe.json** | 风格描述符：关键词、视觉语言与 AI prompt |
| **theme.algorithm.ts** | 生成算法的 TypeScript 源码 |
| **AGENTS 区块** | 可写入 `AGENTS.md` 的主题规则 |
| **导入到项目** | 面向 Codex / Cursor / Claude Code 的可执行契约，含「一次性优化页面」与「长期项目契约」两种模式——后者把契约写进 `CLAUDE.md` / `AGENTS.md`，让一致性长期生效 |

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
  presets.ts             九套内置场景预设
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
  previews/              组件 / 模块 两类预览
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
