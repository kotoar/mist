"use client";

import { Box, Flex, HStack, Image, Link as ChakraLink, Spacer, chakra } from "@chakra-ui/react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { BracketLink, ThemeToggle } from "./action";
import { useRegistryCounts } from "@lib/shared/services/registry";

export type SectionKey = "home" | "case" | "mist" | "puzzles" | "lab";

/**
 * 标准报头: 铭牌(铜) + 登记行(真实册数) + 分区导航。
 * 全站页面复用。桌面对齐设计稿, 移动端报头行换行、导航横向铺开。
 */
export function Masthead({
  current,
  title = "迷雾档案",
}: {
  current?: SectionKey;
  title?: string;
}) {
  const registry = useRegistryCounts();
  return (
    <Box as="header" pt="24px">
      {/* 铭牌行 */}
      <Flex
        align="center"
        justify="space-between"
        gap="12px 24px"
        wrap="wrap"
        pb="14px"
        borderBottom="3px double"
        borderColor="arch.rule"
      >
        <ChakraLink
          asChild
          display="flex"
          alignItems="center"
          gap="14px"
          color="inherit"
          _hover={{ textDecoration: "none" }}
        >
          <NextLink href="/">
            <Image
              src="/icon.png"
              alt="迷雾档案"
              boxSize="42px"
              filter="invert(1)"
              _light={{ filter: "none" }}
            />
            <chakra.h1
              textStyle="headline"
              fontSize="clamp(24px,3.2vw,38px)"
              letterSpacing="4px"
              m="0"
              color="arch.ink"
            >
              {title}
            </chakra.h1>
          </NextLink>
        </ChakraLink>

        <HStack gap="16px" align="center">
          <Box textAlign="right">
            <chakra.div
              fontFamily="serif"
              fontStyle="italic"
              fontSize="12px"
              letterSpacing="1px"
              color="arch.mut"
            >
              侦探事务所 · 内部档案
            </chakra.div>
            <chakra.div
              fontFamily="mono"
              fontSize="11px"
              letterSpacing="1px"
              color="arch.dim"
              textTransform="uppercase"
              mt="3px"
            >
              档案 <Emph>{registry.case}</Emph> · 迷雾 <Emph>{registry.mist}</Emph> · 解谜{" "}
              <Emph>{registry.puzzle}</Emph>
            </chakra.div>
          </Box>
          <ThemeToggle />
        </HStack>
      </Flex>

      {/* 分区导航 */}
      <Flex
        as="nav"
        wrap="wrap"
        align="center"
        rowGap="4px"
        py="11px"
        borderBottom="1px solid"
        borderColor="arch.rule"
      >
        <BracketLink href="/" upper active={current === "home"}>
          主页
        </BracketLink>
        <BracketLink href="/case" upper active={current === "case"}>
          档案
        </BracketLink>
        <BracketLink href="/mist" upper active={current === "mist"}>
          迷雾
        </BracketLink>
        <BracketLink href="/puzzles" upper active={current === "puzzles"}>
          解谜
        </BracketLink>
        <Spacer minW="16px" />
        <BracketLink href="/lab" upper active={current === "lab"}>
          实验室
        </BracketLink>
      </Flex>
    </Box>
  );
}

function Emph({ children }: { children: ReactNode }) {
  return (
    <chakra.b color="arch.ink" fontWeight="500">
      {children}
    </chakra.b>
  );
}
