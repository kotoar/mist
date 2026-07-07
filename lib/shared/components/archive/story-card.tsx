"use client";

import { Box, Flex, Image, Link as ChakraLink, chakra } from "@chakra-ui/react";
import NextLink from "next/link";

export type StoryType = "case" | "detect" | "mist" | "puzzle" | "deepclue";

/** 分类体系: 单一事实来源。text=眉标文案, color=分类色 token, rgb=用于占位纹理/悬停底的原色。 */
const CATEGORY: Record<StoryType, { text: string; color: string; rgb: string }> = {
  case: { text: "演绎", color: "arch.case", rgb: "194,90,74" },
  detect: { text: "探案", color: "arch.case", rgb: "194,90,74" },
  mist: { text: "迷雾", color: "arch.mist", rgb: "95,155,160" },
  puzzle: { text: "解谜", color: "arch.puzzle", rgb: "155,123,181" },
  deepclue: { text: "深层线索", color: "arch.puzzle", rgb: "192,123,160" },
};

export interface StoryCardProps {
  type: StoryType;
  /** 卷宗号(M01 / A07…)。缺省则眉标只显示分类。 */
  index?: string;
  title: string;
  cover?: string | null;
  /** 副信息各段(难度 / 标签 / 作者 / 日期…), 自动过滤空值后以 · 连接。 */
  meta?: (string | undefined | null)[];
  href: string;
  external?: boolean;
}

/** 统一卷宗卡: 首页「最近上新」与 档案库/迷雾库 共用。作为网格单元(自带右/下边线 + 分类色左线)。 */
export function StoryCard(props: StoryCardProps) {
  const cat = CATEGORY[props.type];
  const external = props.external ?? props.href.startsWith("http");
  const metaText = (props.meta ?? []).filter(Boolean).join(" · ");

  const inner = (
    <Box
      as="span"
      display="block"
      h="100%"
      borderRight="1px solid"
      borderBottom="1px solid"
      borderColor="arch.rule"
      borderLeft="2px solid"
      borderLeftColor={cat.color}
      transition="background 0.15s"
      _hover={{ bg: `rgba(${cat.rgb},.10)` }}
    >
      {props.cover ? (
        <Image
          src={props.cover}
          alt={props.title}
          w="full"
          h="112px"
          objectFit="cover"
          borderBottom="1px solid"
          borderColor="arch.ruleSoft"
        />
      ) : (
        <Flex
          h="112px"
          align="center"
          justify="center"
          borderBottom="1px solid"
          borderColor="arch.ruleSoft"
          backgroundImage={`repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(${cat.rgb},.18) 6px, rgba(${cat.rgb},.18) 7px)`}
        >
          <chakra.span fontFamily="mono" fontSize="10.5px" letterSpacing="2.5px" color="arch.mut" textTransform="uppercase">
            Cover
          </chakra.span>
        </Flex>
      )}

      <Box px="18px" pt="16px" pb="18px">
        <chakra.div fontFamily="mono" fontSize="10.5px" letterSpacing="1.5px" textTransform="uppercase" color={cat.color} mb="9px">
          {props.index ? `${props.index} · ` : ""}
          {cat.text}
        </chakra.div>
        <chakra.h4 fontFamily="serif" fontWeight="700" fontSize="19px" letterSpacing="1px" color="arch.ink" m="0 0 8px">
          {props.title}
        </chakra.h4>
        {metaText ? (
          <chakra.div fontFamily="mono" fontSize="10.5px" letterSpacing="1px" color="arch.mut">
            {metaText}
          </chakra.div>
        ) : null}
      </Box>
    </Box>
  );

  return (
    <ChakraLink asChild color="inherit" _hover={{ textDecoration: "none" }} display="block">
      {external ? (
        <a href={props.href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <NextLink href={props.href}>{inner}</NextLink>
      )}
    </ChakraLink>
  );
}

/** 网格容器: 顶/左边线, 卡片补右/下边线, 形成对齐的卷宗格。minCol 控制单元最小宽。 */
export function StoryGrid({
  minCol = "260px",
  gridRef,
  children,
}: {
  minCol?: string;
  gridRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <Box
      ref={gridRef}
      display="grid"
      gridTemplateColumns={`repeat(auto-fill, minmax(${minCol}, 1fr))`}
      borderTop="1px solid"
      borderLeft="1px solid"
      borderColor="arch.rule"
    >
      {children}
    </Box>
  );
}
