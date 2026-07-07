# DeepClue 档案体例 · Design System

**旧报纸档案馆风格的设计系统**——访客读到的不是一款产品，而是一份侦探事务所的内部档案。

- 来源：[deepclue_monorepo/design/mockups/设计系统.dc.html](../deepclue_monorepo/design/mockups/设计系统.dc.html)（体例规范 v0.5.1），组件样例另取自 `案件库.dc.html` 与 `办案界面.dc.html`
- 本目录是 **Claude Design（claude.ai/design）design-system 项目的本地根**：`previews/` 里每个 HTML 首行带 `<!-- @dsCard group="…" -->` 标记，同步后 Claude Design 会按标记生成组件卡片
- 已在线上应用：deepclue web（Chakra UI v3 实现，见 `deepclue_monorepo/deepclue/src/lib/client/components/ui/theme.ts`）

## 目录

```
design-system/
├── README.md          本文件
├── tokens.css         语义变量（暗/亮双主题）+ 字体引入，可直接 link 使用
└── previews/          组件卡片（自包含 HTML，首行 @dsCard 标记）
    ├── foundations-palette.html   用色（暗 + 亮双板）
    ├── foundations-type.html      字体三族 + 五级字阶
    ├── foundations-rules.html     分隔线三式
    ├── actions.html               行动语言（主行动/行内/筛选/检索/导航/翻页/静态）
    ├── masthead.html              标准报头（铭牌 + 日期行 + 分区导航）
    ├── crest.html                 居中报头（顶栏 + 居中导航 + 会徽页题）
    ├── secthead.html              分节标头
    ├── colophon.html              报尾
    ├── case-card.html             卷宗卡
    ├── register.html              登记总册
    ├── seg.html                   预计时长五格
    ├── status-led.html            进度条目（在办/待解）
    ├── roster.html                联络名录
    ├── composer.html              讯问输入器
    ├── bubbles.html               讯问气泡（证人/你/系统矛盾/输入中/物证夹片）
    ├── cell-list.html             在场人员名录
    └── voice.html                 语气体例 + 黑白词表
```

## 用色

两套主题——**案卷夜读（暗，默认）**与**旧纸日间（亮）**——共用同一组语义变量。容器挂 `.arch`，加 `.light` 切亮色。

| 变量 | 语义 | 暗 | 亮 |
|---|---|---|---|
| `--bg` | 底 · 页面背景 | `#100F13` | `#E9E2D0` |
| `--panel` | 面 · 浮层 / 卡底 | `#17161C` | `#E1D9C3` |
| `--ink` | 墨 · 正文标题 | `#E9E3D4` | `#241F14` |
| `--dim` | 次 · 摘要副文 | `#A59D8A` | `#544A37` |
| `--mut` | 弱 · 标签注脚 | `#6E6857` | `#7C715A` |
| `--brass` | **铜 · 唯一可点击色** | `#D9A75A` | `#9A6C20` |
| `--red` | 朱 · 机密 / 警示 | `#C25A4A` | `#9D3A2B` |
| `--rule` | 线 · 分栏分节 | 墨 17% | 墨 22% |
| `--rule-soft` | 线 · 明细轻分隔 | 墨 8% | 墨 10% |
| `--hov` | 铜底 · 悬停 / 当前态 | 铜 14% | 铜 12% |

背景另有一层顶部黄铜光晕（`radial-gradient`，档案馆的一盏台灯），见 `tokens.css`。

## 字体

三族分工。中文衬线挑大梁，等宽全大写、宽字距是这套体例的「档案声纹」。

| 族 | 字体 | 用途 |
|---|---|---|
| 衬线 `--serif` | Noto Serif SC 500/600/700/900 | 标题 · 头条 · 正文摘要 |
| 无衬线 `--sans` | Inter + Noto Sans SC 400/500/600 | 界面正文 · 行动按钮文字 |
| 等宽 `--mono` | JetBrains Mono 400/500/700 | 标签 · 期号 · 状态 · 列头 |

字阶五级（样张见 `foundations-type.html`）：HEADLINE 头条 900 / LEAD 领句 700 / STANDFIRST 引文衬线 / BODY 正文无衬线 / LABEL 等宽全大写 +2px 字距。

> 注：deepclue web 生产实现另加载 Playfair Display（拉丁衬线）与 Cinzel（门头 display）作西文补充；本体例以中文规范为准。

## 铁律

1. **凡铜必可点，凡可点必铜**——且套 `[直角括号]`（双重信号）。静态文字一律不用铜；悬停浮一层极浅铜底，当前页导航项铜底常驻。
2. **朱红只作机密、警示与法务收口**，不作装饰。
3. **以线分栏**：细线分行分栏，点线分明细，`3px double` 双线收一节之口。**无阴影、无圆角**（最大 2px）、无渐变装饰。
4. **动效一律 0.15s 纯色过渡**：只动 background / color / border-color，不缩放、不弹跳。卡片悬停用负边距填底，不位移。
5. **行动动词用档案语**：受理 / 调阅 / 申领 / 进入预审——绝无「开始 / 注册 / 立即体验」。

## 语气体例

视觉是皮，文案是骨。第二人称、现在时——读者就是侦探。句子短、硬、少形容词。错误不是「你错了」，是「线索对不上」。一行自检：**若这句话印在任何一款 SaaS 落地页上也成立，它就不够 DeepClue，重写。**（黑白词表见 `voice.html`）

## 同步到 Claude Design

用 Claude Code 的 `DesignSync` 工具把本目录推到 claude.ai/design 的 design-system 项目：

1. `list_projects` 选目标（或 `create_project` 新建，类型必须是 design system）
2. `finalize_plan`：`localDir` 指向本目录，writes 覆盖 `previews/**/*.html` + `tokens.css` + `README.md`
3. `write_files` 按计划上传；卡片索引由各 preview 首行的 `@dsCard` 标记自动生成

## 姊妹变体

迷雾档案（mist）的**夜雾**变体——同一套语法、冷雾青换黄铜——设计稿在 `mist/design/mockups/`（体例见其 `设计系统.dc.html`），未收录进本体例。
