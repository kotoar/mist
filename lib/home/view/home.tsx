"use client";

import { Box, For, Link as ChakraLink, chakra } from "@chakra-ui/react";
import { Masthead } from "@lib/shared/components/archive/masthead";
import { SectionHead } from "@lib/shared/components/archive/section-head";
import { Colophon } from "@lib/shared/components/archive/colophon";
import { BracketLink } from "@lib/shared/components/archive/action";
import { StoryCard, StoryGrid, StoryType } from "@lib/shared/components/archive/story-card";

export function HomeView() {
  return (
    <Box maxW="1360px" mx="auto" px={{ base: "20px", md: "32px" }} minH="100vh">
      <Masthead current="home" />

      {/* 最近上新 */}
      <Box as="section">
        <SectionHead title="最近上新" />
        <StoryGrid minCol="220px">
          <For each={recent}>
            {(item, index) => (
              <StoryCard
                key={index}
                type={item.type}
                title={item.title}
                cover={item.cover}
                meta={[item.date, item.author]}
                href={item.url}
              />
            )}
          </For>
        </StoryGrid>
      </Box>

      {/* 开发部 · 联络 */}
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(300px, 1fr))" }}
        gap="0 44px"
        pb="20px"
      >
        <Box>
          <SectionHead title="开发部" />
          <chakra.p
            fontFamily="serif"
            fontSize="13.5px"
            color="arch.dim"
            lineHeight="1.95"
            m="14px 0 0"
            whiteSpace="pre-line"
          >
            {INTRO}
          </chakra.p>
          <Box mt="16px">
            <BracketLink external href="/download/android/mistcase-android-0.0.1.apk">
              《迷雾档案》安卓版 下载
            </BracketLink>
          </Box>
        </Box>

        <Box>
          <SectionHead title="联络" />
          <Box mt="6px">
            <For each={contacts}>
              {(c, index) => (
                <ContactRow
                  key={index}
                  label={c.label}
                  value={c.value}
                  href={c.href}
                  last={index === contacts.length - 1}
                />
              )}
            </For>
          </Box>
        </Box>
      </Box>

      <Colophon />
    </Box>
  );
}

function ContactRow({
  label,
  value,
  href,
  last,
}: {
  label: string;
  value: string;
  href: string;
  last?: boolean;
}) {
  return (
    <ChakraLink
      asChild
      display="flex"
      alignItems="baseline"
      justifyContent="space-between"
      gap="12px"
      fontFamily="mono"
      fontSize="12.5px"
      py="9px"
      color="arch.brass"
      borderBottom={last ? "none" : "1px dotted"}
      borderColor="arch.ruleSoft"
      _hover={{ textDecoration: "none", bg: "arch.hov" }}
      transition="background 0.15s"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <chakra.span whiteSpace="nowrap">[{label}]</chakra.span>
        <chakra.span color="arch.mut" fontSize="10.5px" letterSpacing="1px">
          {value}
        </chakra.span>
      </a>
    </ChakraLink>
  );
}

const INTRO = `《迷雾档案》是一个推理游戏集合的企划。我们会集合各种形式的推理解谜游戏。
目前我们仍处于开发的早期阶段，各种游戏模式都在更新中，自媒体的内容也在筹备中，欢迎大家关注我们的社交账号！`;

const contacts: { label: string; value: string; href: string }[] = [
  { label: "邮箱", value: "mistcase@deepclue.app", href: "mailto:mistcase@deepclue.app" },
  { label: "小红书", value: "@deepclue", href: "https://xhslink.com/m/3keCJl9wtyp" },
  { label: "哔哩哔哩", value: "@DeepClue侦探事务所", href: "https://space.bilibili.com/3546973590260381" },
  { label: "QQ", value: "迷雾档案 MistCase", href: "https://qm.qq.com/q/AYvSHdaldC" },
];

const recent: { type: StoryType; title: string; cover?: string; date: string; author?: string; url: string }[] = [
  {
    type: "mist",
    title: "M03 归还日",
    cover: "https://egdwsmbwm1nmmqdr.public.blob.vercel-storage.com/mists/mist-03.jpg",
    date: "2026-02-19",
    author: "DeepClue",
    url: "/mist/mist-03",
  },
  {
    type: "mist",
    title: "M04 白化",
    cover: "https://egdwsmbwm1nmmqdr.public.blob.vercel-storage.com/mists/mist-04.jpg",
    date: "2026-02-19",
    author: "DeepClue",
    url: "/mist/mist-04",
  },
  {
    type: "detect",
    title: "A07 孤岛工作室案件",
    cover: "https://egdwsmbwm1nmmqdr.public.blob.vercel-storage.com/cases/a07-cover.jpeg",
    date: "2026-02-09",
    author: "DeepClue",
    url: "/detect/case-A07",
  },
  {
    type: "detect",
    title: "A08 独居老人中毒案",
    cover: "https://egdwsmbwm1nmmqdr.public.blob.vercel-storage.com/cases/a08-cover.jpeg",
    date: "2026-02-09",
    author: "DeepClue",
    url: "/detect/case-A08",
  },
  {
    type: "puzzle",
    title: "命栽七号街",
    cover: "/puzzles/street7.png",
    date: "2025-12-06",
    author: "天色盐",
    url: "https://street7.mistcase.app",
  },
];
