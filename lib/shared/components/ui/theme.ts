"use client";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

/**
 * DeepClue 档案体例 · Chakra 主题
 * 来源: design/mockups 设计系统 tokens.css (v0.5.1)
 * 两套主题——案卷夜读(暗,默认) 与 旧纸日间(亮)——共用同一组语义变量。
 * 约定: base = 亮色值, _dark = 暗色值; 全局 defaultTheme="dark", 故默认为暗色。
 *
 * 铁律(详见 design/mockups/_ds/.../README.md):
 * 1. 凡铜必可点, 凡可点必铜, 且套 [方括号]。静态文字永不用铜。
 * 2. 朱红只作机密 / 警示 / 法务收口。
 * 3. 以线分栏; 无阴影; 无圆角(≤2px); 动效一律 0.15s 纯色过渡。
 */

// —— 亮 / 暗 双值。base = 亮, _dark = 暗 ——
const dual = (light: string, dark: string) => ({ value: { base: light, _dark: dark } });

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        serif: { value: "'Noto Serif SC', 'Songti SC', 'STSong', serif" },
        sans: { value: "'Inter', 'Noto Sans SC', -apple-system, sans-serif" },
        mono: { value: "'JetBrains Mono', 'SFMono-Regular', monospace" },
      },
    },

    semanticTokens: {
      colors: {
        arch: {
          bg: dual("#e9e2d0", "#100f13"), // 底 · 页面背景
          panel: dual("#e1d9c3", "#17161c"), // 面 · 浮层 / 卡底
          ink: dual("#241f14", "#e9e3d4"), // 墨 · 正文标题
          dim: dual("#544a37", "#a59d8a"), // 次 · 摘要副文
          mut: dual("#7c715a", "#6e6857"), // 弱 · 标签注脚
          brass: dual("#9a6c20", "#d9a75a"), // 铜 · 唯一可点击色
          red: dual("#9d3a2b", "#c25a4a"), // 朱 · 机密 / 警示
          rule: dual("rgba(38,31,18,.22)", "rgba(232,226,212,.17)"), // 线 · 分栏分节
          ruleSoft: dual("rgba(38,31,18,.10)", "rgba(232,226,212,.08)"), // 线 · 明细轻分隔
          hov: dual("rgba(154,108,32,.12)", "rgba(217,167,90,.14)"), // 铜底 · 悬停 / 当前态
          // 三类分区色标(卷宗类型)
          mist: dual("#3f7d82", "#5f9ba0"), // 迷雾
          case: dual("#9d3a2b", "#c25a4a"), // 探案(同朱)
          puzzle: dual("#6d5090", "#9b7bb5"), // 解谜
        },
      },
    },

    // —— 字阶五级 ——
    textStyles: {
      headline: {
        value: {
          fontFamily: "serif",
          fontWeight: "900",
          letterSpacing: "3px",
          lineHeight: "1.2",
        },
      },
      lead: {
        value: {
          fontFamily: "serif",
          fontWeight: "700",
          letterSpacing: "1px",
          lineHeight: "1.4",
        },
      },
      standfirst: {
        value: {
          fontFamily: "serif",
          fontWeight: "400",
          lineHeight: "1.95",
        },
      },
      label: {
        value: {
          fontFamily: "mono",
          fontWeight: "400",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        },
      },
    },
  },

  globalCss: {
    "html, body": {
      fontFamily: "sans",
      background: "arch.bg",
      color: "arch.ink",
      lineHeight: "1.6",
    },
    body: {
      minHeight: "100vh",
      backgroundAttachment: "fixed",
      // 顶部黄铜光晕, 档案馆的一盏台灯
      backgroundImage:
        "radial-gradient(90% 40% at 50% -10%, rgba(217,167,90,.07), transparent 60%)",
      _light: {
        backgroundImage:
          "radial-gradient(90% 40% at 50% -10%, rgba(154,108,32,.10), transparent 60%)",
      },
    },
    "::selection": {
      background: "arch.hov",
    },
  },
});

export const system = createSystem(defaultConfig, config);
