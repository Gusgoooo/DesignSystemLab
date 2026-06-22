<div align="center">

# Design System Lab

**面向长期 AI coding 项目的设计归一化系统**

它不试图回答“这个页面能不能更酷炫”，而是回答另一个更长期的问题：
当一个产品由 AI 持续生成、修改、扩展时，设计系统如何不漂移。

</div>

---

AI coding 项目需要长期管理的不只是前端工程，还有设计本身。工程侧会管理目录、依赖、测试、接口和代码风格；设计侧同样需要管理 token、组件语法、交互规则、页面结构和状态表达。否则页面做着做着就会越来越不像同一个产品：视觉还在，但主色、圆角、密度、状态色开始漂移；组件还在，但 Button 被拿来做 Tabs，Card 变成空装饰容器，Table 堆满字段，Dialog 丢掉 focus、open state、提交状态和错误反馈。

Design System Lab 的目标不是让单个页面变得更炫，而是让长期 AI coding 项目的 UI 进入同一套系统。

它通过两层契约做归一化：

- **Token Contract**：限制视觉一致性。颜色、语义色、圆角、密度、字体、阴影、动效、状态色和明暗主题，都从 seed 确定性生成，并导出为 CSS 变量、JSON 与主题 manifest。
- **Component / Block Spec**：限制组件使用、交互逻辑和页面逻辑。Button 是命令，不是单选切换；Tabs 才适合 view / mode / status switch；Card 是下一层内容预览，不是空壳；Table 要保留身份、状态、关键事实和行操作；Overlay 要保留 trigger、open state、focus return、dismiss、表单状态和 destructive confirmation。

这些规则不会被塞进一个巨大的 prompt。AI 会先读取 `design-rules/index.json`，识别当前页面包含哪些元素，再按需读取本地规则或 raw GitHub URL：先分析，再分别加载匹配的 token、component、block、state 和 QA spec。这样 prompt 不会无限膨胀，规则也能随着项目长期演进。

## 同类产品解决了什么

现有方案都解决了重要问题，但它们大多不是为“长期 AI coding 项目的设计治理”设计的。

组件库解决“人类开发者如何快速搭出稳定 UI”。主题系统解决“组件库内部如何统一视觉”。规范文档解决“团队如何描述设计原则”。但长期 AI coding 项目还需要另一层：**让 AI 在每次改页面时，都能识别当前 UI 结构，读取正确规则，并在不破坏业务逻辑的前提下做设计归一化。**

### 与 shadcn 的区别

shadcn 是很好的实现材料：它提供可复制、可拥有源码的组件和 blocks。Design System Lab 不替代 shadcn，而是在 AI coding 场景里补上“长期设计治理层”。

| 维度 | shadcn 主要解决 | 美中不足 | Design System Lab 的解法 |
| --- | --- | --- | --- |
| 组件来源 | 提供高质量组件源码和 registry blocks | registry 是材料库，不是项目长期规则系统 | 把组件使用规则写成 spec，让 AI 知道何时用、怎么用、不能怎么用 |
| 视觉一致性 | 依赖 CSS variables 与主题配置 | 能统一基础样式，但不负责跨页面设计漂移治理 | seed → token 确定性生成，形成可复现、可审计的视觉契约 |
| AI 决策 | AI 可以引用 shadcn 组件 | 仍可能机械套组件、复制 demo、把 Button 当 Tabs、把 Card 当装饰 | rule router 先识别页面元素，再加载匹配 spec，约束 AI 的组件决策 |
| 页面结构 | 提供 blocks 作为起点 | block 本身不保证业务结构、权限、状态和交互被保留 | block spec 要求保留 API、状态、权限、验证、loading/error/empty 等行为 |
| 长期项目 | 适合作为组件实现基础 | 不直接管理多轮 AI 修改后的风格漂移 | 契约写入 `AGENTS.md` / `CLAUDE.md`，让规则进入长期协作上下文 |
| 未来 GenUI | registry 列出已有组件 | AI 可能被固定在已有组件清单里做魔改 | 只限定优解标准，不强制固定组件形态，允许 AI 为当前问题生成更合适的组件 |

### 与 antd 的区别

antd 是成熟的企业级组件体系，强在完整组件、交互默认值和库内一致性。Design System Lab 借鉴“设计可以算法化派生”的思路，但目标不同：它不是绑定某个运行时组件库，而是把设计规则编译成 AI 可执行的项目契约。

| 维度 | antd 主要解决 | 美中不足 | Design System Lab 的解法 |
| --- | --- | --- | --- |
| 设计系统形态 | 完整企业级组件库和设计语言 | 设计决策主要绑定 antd 组件体系 | token 与 spec 独立存在，可迁移到任意 Tailwind / shadcn-like 项目 |
| 主题生成 | 库内主题算法与 token | 主要服务 antd runtime 和组件实现 | 输出 CSS variables、JSON、AI rules，不要求项目运行时绑定 antd |
| 组件选择 | 给出固定组件和交互默认值 | AI 容易围绕固定组件做适配，而不是为当前问题找最优结构 | component / block spec 描述设计优解，允许 AI 自己生成符合规则的实现 |
| 使用对象 | 主要面向人类开发者 | AI 长期执行规则不是核心目标 | 面向 Codex / Cursor / Claude Code 等 AI coding 工具导出可执行契约 |
| 长期一致性 | 在 antd 生态内稳定 | 跨库、跨项目、跨 AI 多轮修改时治理能力有限 | 通过 token、spec、rule router、completion gate 管理长期漂移 |
| prompt 管理 | 不是 prompt 路由系统 | 无法解决“大 prompt 一次性塞满”的问题 | `index.json` 路由规则，本地优先，缺失时读取 raw GitHub spec |

## 我的归一化解法

Design System Lab 把“设计系统”拆成四层可执行资产。

```
Seed
  ↓
Token Contract
  ↓
Component / Block Spec
  ↓
Rule Router
  ↓
AI Project Contract
```

### 1. Token 归一化：限制视觉漂移

Token Contract 负责“长什么样”。

- seed 确定主题方向
- OKLCH 算法生成可感知均匀的明暗色阶
- semantic token 决定 primary、background、card、popover、muted、accent、destructive、border、ring
- status token 统一 success、warning、info、danger
- chart token 统一数据系列色
- radius、density、typography、elevation、motion 统一组件触感
- shadcn adapter 把语义 token 映射到 shadcn/ui CSS variables

结果是：AI 不需要凭感觉重新挑颜色、圆角、阴影和状态色。它只消费已经确定的视觉合同。

### 2. Spec 归一化：限制组件与页面逻辑漂移

Component / Block Spec 负责“怎么用”。

规则库位于 `design-rules/`，当前覆盖：

- Core：rule router、UI normalization、token binding、token system、visual QA、completion compliance、product alignment
- Blocks：page shell、dashboard
- Components：cards、tables、page headings、sidebars、actions/buttons、filters/controls、forms/inputs、tabs、overlays、badges/alerts、metrics/charts
- Patterns：page background、UI states、semantic/category color

这些 spec 不只是样式建议，而是 AI 修改 UI 时必须遵守的产品规则：保留业务逻辑、API、状态、权限、验证、数据加载、错误状态、空状态、loading、focus、selected、disabled、responsive behavior，再做视觉和组件结构归一化。

### 3. Rule Router：分散加载 prompt

规则入口是 `design-rules/index.json`。

AI 的流程是：

1. 读取 rule index。
2. 加载 `requiredAlways` 核心规则。
3. 识别页面结构和元素类型。
4. 根据 `rules[].appliesTo` 匹配 component / block / pattern spec。
5. 本地规则优先；目标项目没有本地文件时读取 raw GitHub URL。
6. 修改前输出 Rule Read Confirmation，列出实际打开的规则。
7. 修改后通过 completion compliance gate 检查。

这样做的重点是：prompt 不需要一次性很长。AI 先分析，再读取当前页面真正需要的规则。

### 4. Project Contract：把规则带进真实项目

导出时可以选择一次性页面优化，也可以选择长期项目契约。

长期项目契约会落到三个触点：

- 全局 CSS token block
- `theme-lab.json`
- AI 工具原生指令文件，例如 `AGENTS.md`、`CLAUDE.md`、Cursor rules

这让设计系统不只是这一次 prompt 的上下文，而是长期项目的一部分。

## 为什么不依赖组件库

组件库仍然有价值，但它不应该成为未来 GenUI 的边界。

在传统前端里，组件库提供固定组件，人类开发者在这些组件里选择和组合。AI coding 早期也会自然依赖 registry：antd、shadcn、Tailwind UI、各种 blocks 都是很好的材料。但长期看，AI 一定可以为当前问题写出更贴合的组件，而不是永远被限制在某个组件库列出的清单里。

未来的 GenUI 更像是：AI 根据当前产品、当前任务、当前数据结构、当前交互约束，生成一个最适合当下问题的组件。设计系统需要规定的不是“必须用哪一个现成组件”，而是“什么样的解法是优解”：

- 是否保留业务流程
- 是否符合视觉 token
- 是否符合组件使用规则
- 是否保留状态、权限、验证和可访问性
- 是否在页面结构中承担正确职责
- 是否能跨页面长期保持一致

这也是 Design System Lab 不把自己做成另一个组件库的原因。它更像设计视角的约束层：告诉 AI 哪些方向是对的，哪些行为会造成长期 UI 债务。至于具体组件实现，可以来自 shadcn，可以来自已有项目组件，也可以由 AI 为当前问题重新生成。

## 核心特性

- **确定性 token 生成** — 同一组 seed 永远导出同一套结果，可复现、可审计、可版本化。
- **Component / Block Spec** — 把组件使用、交互逻辑、页面逻辑写成 AI 可执行规则。
- **Rule Router** — 根据页面元素按需读取本地规则或 raw GitHub URLs，避免超长 prompt。
- **shadcn 兼容但不绑定** — 可消费 shadcn/ui token 和组件，也允许项目自有组件或 AI 生成组件。
- **两类实时预览** — 组件级预览与模块级预览同时验证主题在真实 UI 中是否站得住。
- **九套场景预设** — AI、SaaS、后台、金融、内容、客服、电商、营销、开发。
- **项目导入契约** — 支持一次性页面优化，也支持长期项目契约。

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，进入 Theme Lab 后调整 seed、查看预览并导出契约。

常用命令：

```bash
npm run typecheck
npm run build
npm run build:static
```

## 工作流

1. **定义视觉系统**：选择预设或调整 seed，生成 token。
2. **检查真实场景**：在 components / blocks 预览中验证按钮、表单、卡片、表格、图表、dashboard 等模式。
3. **导出契约**：复制 CSS、JSON、AI task prompt 或长期项目契约。
4. **交给 AI 执行**：Codex / Cursor / Claude Code 读取 token 与 design rules，对现有项目做 UI normalization。

## 导出产物

| 产物 | 用途 |
| --- | --- |
| **global CSS block** | `:root` 与 `.dark` CSS 变量，可放入现有 `globals.css` |
| **theme-lab.json** | 主题 DNA、seed、token contract、design rule library 与 AI coding rules |
| **theme.preset.json** | 可分享、可复现的 seed 预设 |
| **vibe.json** | 风格描述符：关键词、视觉语言、AI prompt context |
| **theme.algorithm.ts** | 生成算法源码，便于迁移或审计 |
| **AI instruction block** | 可写入 `AGENTS.md` / `CLAUDE.md` 等工具原生指令文件 |
| **Project import prompt** | 面向 AI coding 工具的执行任务包，含 raw GitHub rule URLs |

## 静态发布

项目使用 Next.js static export：

- `next.config.ts` 使用 `output: "export"`
- 构建产物输出到 `out/`
- `postbuild` 会处理静态 HTML，保留 hydration marker 并把 `/_next/` 路径改为相对路径
- `vercel.json` 已配置 `outputDirectory: "out"`

生成静态产物：

```bash
npm run build:static
```

## 项目结构

```
app/
  page.tsx               落地页
  theme-lab/             主应用
  dashboard/             shadcn dashboard 示例
  globals.css            Tailwind 与主题变量
lib/theme/
  schema.ts              seed 与 token 类型
  defaults.ts            默认 seed
  presets.ts             九套场景预设
  derive-theme.ts        生成流程
  algorithms/            color / type / radius / density / elevation / motion
  semantic.ts            语义 token 映射
  shadcn-adapter.ts      shadcn 兼容层
  vibe.ts                vibe 描述符
  export-*.ts            CSS / JSON / prompt / AGENTS / algorithm 导出
design-rules/
  index.json             AI 规则路由入口
  core/                  执行边界、token、QA、completion gate
  blocks/                page shell、dashboard 等 block spec
  components/            cards、tables、forms、tabs、overlays 等 component spec
  patterns/              states、semantic color、page background
components/theme-lab/
  theme-lab-shell.tsx
  seed-control-panel.tsx
  preview-*.tsx
  previews/
  export-panel.tsx
components/ui/            shadcn/ui 基础组件
```

## 技术栈

- **框架** — Next.js 16 · React 19 · TypeScript
- **样式** — Tailwind CSS v4 · shadcn/ui · Radix UI
- **预览与交互** — Recharts · TanStack Table · dnd-kit · assistant-ui · Sonner · Lucide
- **工具** — Zod · date-fns

## 贡献者

- **Gus**
- **Alibaba**
