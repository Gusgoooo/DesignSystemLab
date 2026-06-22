<div align="center">

# Design System Lab

**面向长期 AI Coding 项目的 Spec-driven 设计系统生成器**

Design System Lab 不是组件库，也不是传统主题编辑器。它生成一套轻量的设计系统契约，让 AI Coding Agent 能在用户已有项目中持续遵守 token、spec 和页面规则。

</div>

---

## 问题定义

设计系统发展到今天，常见资产仍然是三件套：

1. Design Token
2. 某种组件库或 registry
3. 视觉风格指南

这套三件套对人类团队仍然有效。shadcn/ui、Ant Design 主题能力、SAP Fiori、IBM Carbon、Material Design 都已经在组件实现、主题能力、交互规范上做得很成熟。

但在 AI Coding 项目里，问题并没有被真正解决。AI 可以把单个页面做得不错，却很容易在多轮修改后把产品做散：

- 页面之间的密度、圆角、阴影、状态色开始漂移
- 同一种交互在不同页面出现不同表达
- `Button` 被拿来模拟 tabs 或状态切换
- `Card` 变成只有图标、标题和描述的装饰容器
- `Table` 堆满后端字段，但丢掉身份、状态、关键事实和行操作
- `Dialog` / `Sheet` 丢掉 open state、focus return、提交状态和错误反馈

所以 Design System Lab 解决的不是“如何生成一个更酷的页面”，而是：

> 如何让 AI 在长期项目里持续遵守同一套设计系统。

## 核心判断

AI 时代的设计系统，重点会从“定义组件长什么样”，转向“定义组件背后的场景语义”。

一个 tab 不一定要永远来自某个固定 registry。它可以有不同视觉表达，但必须承担单选视图状态，保留 selected value、keyboard navigation、panel state，并且不能被当成 save/export/delete 这类命令按钮。

一个 card 也不是圆角矩形。它的本质是下一层内容的数据 preview，帮助用户在点击前预判内容，在并列展示时比较对象差异。

这就是 Design System Lab 的方向：淡化 registry，强化 spec。组件库、blocks、项目已有组件、AI 现场生成的组件都可以作为实现材料；真正需要长期稳定的是 token contract 和 component / block spec。

## 默认只落 3 个文件

长期接入时，Design System Lab 默认只在用户项目里落三类文件。

| 文件 | 作用 | 默认安装 |
| --- | --- | --- |
| `globals.css` 或 `app/globals.css` 中的 token block | 运行时视觉契约。提供 surface、foreground、status、chart、radius、density、typography、elevation、motion，以及 shadcn adapter tokens。 | 是 |
| `theme-lab.json` | 机器可读设计系统 manifest。记录 seed、token contract、vibe、AI rules、rule index URL、raw spec base URL。 | 是 |
| AI 工具原生指令文件 | 长期执行协议。根据工具写入 `AGENTS.md`、`CLAUDE.md`、`.cursor/rules/theme-lab.mdc`、`.github/copilot-instructions.md`、`GEMINI.md` 或 `.windsurfrules`。 | 是 |

可选项不会默认安装：

| 可选项 | 使用场景 |
| --- | --- |
| `design-rules/` | 只有用户需要本地、离线、内网或深度定制 spec 时才复制。默认通过 raw GitHub URL 按需读取。 |
| `theme.preset.json` | 需要分享、复现或版本化某套 seed preset 时导出。 |
| `theme.algorithm.ts` | 目标项目需要拥有、审计或二次开发 token 生成算法时导出。 |

默认路径不复制组件源码，不安装运行时 SDK，不创建新的组件货架。它安装的是设计治理层。

## 技术架构

```text
Seed
  -> Token Compiler
  -> Runtime CSS Token Block
  -> theme-lab.json
  -> Rule Router
  -> Component / Block Spec
  -> Tool-native AI Instruction
  -> AI Coding Execution
```

### 1. Seed 到 Token Compiler

Seed 是一组较小的产品级设计输入：

- `color`: primary、neutral、status、background、foreground
- `shape`: radius、radiusRatio
- `density`: mode、controlHeight、densityRatio
- `typography`: font family、scaleRatio、heading/body weight、trackingBias
- `material`: elevation、shadowAlpha、borderContrast、surfaceContrast
- `motion`: motion level、durationBase
- `vibe`: domain、tone、temperature、expression

Token Compiler 会确定性生成：

- map tokens：OKLCH 色阶、radius、density、typography、elevation、motion
- semantic tokens：`--surface-canvas`、`--content-primary`、`--action-primary`、`--status-success-bg`、`--border-default`
- shadcn adapter tokens：`--background`、`--foreground`、`--card`、`--primary`、`--muted`、`--border`、`--ring`、`--sidebar`
- density primitives：`--control-height-md`、`--control-padding-x`、`--section-gap`、`--panel-padding`、`--table-cell-padding-x`、`--list-row-height`

AI 后续改 UI 时不需要重新发明颜色、圆角、阴影、密度和状态色，只需要消费这套运行时 token。

### 2. Component / Block Spec

Spec 不是样式清单，也不是组件源码。它描述的是 UI 元素在产品中的职责、引用条件、执行重点和禁止事项。

当前规则库覆盖：

- Core：rule router、UI normalization、token binding、token system、visual QA、completion compliance、product alignment
- Blocks：page shell、dashboard
- Components：cards、tables、page headings、sidebars、actions/buttons、filters/controls、forms/inputs、tabs、overlays、badges/alerts、metrics/charts
- Patterns：page background、UI states、semantic/category color

例如：

- `card.md` 定义 card 是数据 preview 和渐进探索入口，不是装饰容器
- `table.md` 定义 table 是调查入口，必须保留身份、状态、关键事实、排序、选择、分页和行操作
- `tabs.md` 定义 tabs 是单选视图状态，不是命令按钮
- `overlays.md` 定义 overlay 必须保留 trigger、open state、focus trap/return、dismiss、scroll、form state 和 async error

### 3. Rule Router

规则不会一次性塞进一个巨大 prompt。AI 先分析，再按需读取。

执行流程：

1. 读取 `design-rules/index.json`
2. 加载所有 `requiredAlways` 核心规则
3. 识别当前页面或 scope 中的元素类型
4. 根据 `rules[].appliesTo` 匹配 component / block / pattern spec
5. 只打开匹配到的 `rules[].source`
6. 如果目标项目有本地 `design-rules/`，优先读本地
7. 如果没有本地规则，读取 raw GitHub URL
8. 修改前输出 Rule Read Confirmation，列出实际读取的规则
9. 修改后通过 completion compliance gate 检查

这样可以避免 prompt 无限膨胀，也能让 spec 随项目长期演进。

### 4. AI Project Contract

AI 指令文件把设计系统变成长期项目规则。

它会要求 AI：

- 修改 UI 前读取 `theme-lab.json`
- 把 global CSS token block 当作视觉 source of truth
- 通过 `design-rules/index.json` 路由 component / block spec
- 保留 routes、navigation、API、data loading、mutations、event handlers、state、validation、permissions、feature flags、domain copy
- 不使用 raw Tailwind palette、hardcoded hex、arbitrary OKLCH、one-off shadow、随机渐变和无关重设计
- 最终报告实际读取的规则、保留的业务行为、token audit、状态检查和剩余风险

## 应用模式

| 模式 | 当前状态 | 说明 |
| --- | --- | --- |
| 长期设计系统 | 推荐 | 安装三文件契约：global CSS token block、`theme-lab.json`、AI 工具原生指令文件。 |
| 一次性优化 | 建设中 | 计划用于单个 scope 的短期 UI 规整，不落长期文件。当前 UI 中已禁用，因为治理效果有限。 |

Design System Lab 更推荐长期模式。没有文件落到目标项目里，AI 的项目记忆就会变弱，设计漂移很快会回来。

## 使用流程

1. 选择场景 preset，或手动调整 seed
2. 在模块、组件、Spec、说明四个视图中检查结果
3. 导出 Project Import Prompt
4. 在 Codex、Claude Code、Cursor、Qoder 等 AI Coding 工具中运行 prompt
5. AI 在目标项目中安装三文件契约
6. 后续 UI 修改都通过同一套 token vocabulary 和 spec routing protocol 执行

## 与现有系统的关系

### shadcn/ui

shadcn/ui 是很好的源码 registry 和实现材料。Design System Lab 兼容 shadcn 的 CSS variables 和组件语义，但不把 shadcn registry 当作 GenUI 的边界。

### Ant Design

Ant Design 的主题算法和企业组件体系非常成熟。Design System Lab 借鉴“设计可以算法化派生”的思路，但输出的是 CSS variables、JSON、spec 和 AI 指令，不要求目标项目运行时绑定 antd。

### SAP Fiori / IBM Carbon / Material Design

这些系统沉淀了成熟的人类团队交互规范。Design System Lab 更关注如何把类似规则变成 AI 可读取、可路由、可执行、可验收的项目契约。

## 导出产物

| 产物 | 作用 |
| --- | --- |
| global CSS block | 运行时 token 层，写入用户项目已有全局 CSS 文件。 |
| `theme-lab.json` | 机器可读设计系统 manifest 和 AI rule entrypoint。 |
| AI instruction block | 写入 `AGENTS.md`、`CLAUDE.md`、Cursor rules 等工具原生指令文件。 |
| Project import prompt | 让 AI 在目标项目安装并应用契约的执行包。 |
| `theme.preset.json` | 可分享、可复现的 seed preset。 |
| `vibe.json` | 风格描述符和 AI context。 |
| `theme.algorithm.ts` | 可选的确定性 token compiler 源码。 |

## 仓库结构

```text
app/
  page.tsx
  theme-lab/
  dashboard/
  globals.css

components/theme-lab/
  theme-lab-shell.tsx
  seed-control-panel.tsx
  export-panel.tsx
  preview-tabs.tsx
  previews/
    blocks-preview.tsx
    components-preview.tsx
    spec-preview.tsx
    doc-preview.tsx

components/ui/
  shadcn/ui base components

lib/theme/
  schema.ts
  defaults.ts
  presets.ts
  derive-theme.ts
  algorithms/
  semantic.ts
  shadcn-adapter.ts
  vibe.ts
  export-css.ts
  export-json.ts
  export-prompt.ts
  export-agents.ts
  export-algorithm.ts

design-rules/
  index.json
  core/
  blocks/
  components/
  patterns/
```

## 本地开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，进入 Design System Lab。

常用检查：

```bash
npm run typecheck
npm run build
npm run build:static
```

项目使用 Next.js static export：

- `next.config.ts` 使用 `output: "export"`
- 静态产物输出到 `out/`
- `postbuild` 会处理静态路径并验证导出结果

## 当前边界

Design System Lab 当前重点解决：

- 确定性 token 生成
- shadcn-compatible semantic token 输出
- spec-driven component / block rules
- raw GitHub rule routing
- 面向 AI Coding 工具的长期项目契约
- 用真实 UI preview 检查 token 在不同场景、密度和状态下是否稳定

它暂时不解决：

- 在用户项目里安装完整组件库
- 替换用户已有 UI 技术栈
- 在不落文件的情况下保证长期治理效果
- 后端持久化、账号体系或多人协作

## 贡献者

- Gus
- Alibaba
