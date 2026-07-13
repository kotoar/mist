"use client";

import { Box, Flex, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { GameTopbar } from "./game-topbar";

/**
 * 桌面办案界面骨架: 卷宗栏 + 左(案卷) / 右(讯问/推理/迷雾) 双栏。
 * 左栏可滚动、正文居中限宽; 右栏为浮层底色, 自成 header / 滚动区 / footer。
 */
export function GameScreen({
  label,
  actions,
  left,
  right,
}: {
  label?: string;
  actions?: ReactNode;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <Box h="100vh" overflow="hidden" display="flex" flexDirection="column">
      <GameTopbar label={label} actions={actions} />
      <Box display="grid" gridTemplateColumns="1.4fr 1fr" flex="1" minH="0">
        <Box overflowY="auto" borderRight="1px solid" borderColor="arch.rule">
          <Box maxW="640px" mx="auto" px={{ base: "24px", md: "40px" }} pt="34px" pb="60px">
            {left}
          </Box>
        </Box>
        <Flex direction="column" minH="0" bg="arch.panel" overflow="hidden">
          {right}
        </Flex>
      </Box>
    </Box>
  );
}

/** 右栏顶栏: 分区名(左) + 进度(右)。 */
export function PanelHeader({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap="12px"
      px="22px"
      py="14px"
      borderBottom="1px solid"
      borderColor="arch.rule"
      flexShrink={0}
    >
      <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="2px" color="arch.mut" textTransform="uppercase">
        {title}
      </chakra.span>
      {meta ? (
        <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="1px" color="arch.dim">
          {meta}
        </chakra.span>
      ) : null}
    </Flex>
  );
}

/** 数字强调(进度里的当前值)。 */
export function Emph({ children }: { children: ReactNode }) {
  return (
    <chakra.b color="arch.ink" fontWeight="500">
      {children}
    </chakra.b>
  );
}

/** 右栏可滚动内容区。 */
export function PanelScroll({ children }: { children: ReactNode }) {
  return (
    <Box flex="1" minH="0" overflowY="auto" px="22px" py="20px">
      {children}
    </Box>
  );
}

/** 右栏底部固定区(输入器等)。 */
export function PanelFooter({ children }: { children: ReactNode }) {
  return (
    <Box borderTop="1px solid" borderColor="arch.rule" bg="arch.panel" px="22px" py="14px" flexShrink={0}>
      {children}
    </Box>
  );
}

/**
 * 移动办案界面骨架: 卷宗栏 + 单栏滚动内容 + 底部固定区(标签切换 + 输入器)。
 */
export function MobileGameScreen({
  label,
  actions,
  content,
  bottom,
}: {
  label?: string;
  actions?: ReactNode;
  content: ReactNode;
  bottom: ReactNode;
}) {
  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      <GameTopbar label={label} actions={actions} />
      <Box flex="1" minH="0" overflowY="auto" px="16px" py="18px">
        {content}
      </Box>
      <Box borderTop="1px solid" borderColor="arch.rule" bg="arch.panel" px="14px" py="12px" flexShrink={0}>
        {bottom}
      </Box>
    </Flex>
  );
}

/** 标签切换项(移动端 案情/讯问 等)。当前态铜底。 */
export function Tab({
  active,
  onClick,
  indicator,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  indicator?: boolean;
  children: ReactNode;
}) {
  return (
    <Box position="relative" display="inline-flex">
      <chakra.button
        type="button"
        onClick={onClick}
        fontFamily="mono"
        fontSize="12px"
        letterSpacing="1px"
        color="arch.brass"
        bg={active ? "arch.hov" : "transparent"}
        border="1px solid"
        borderColor={active ? "arch.brass" : "arch.rule"}
        borderRadius="0"
        px="12px"
        py="6px"
        cursor="pointer"
        whiteSpace="nowrap"
        transition="background 0.15s"
        _hover={{ bg: "arch.hov" }}
      >
        [{children}]
      </chakra.button>
      {indicator ? (
        <Box position="absolute" top="-3px" right="-3px" w="7px" h="7px" bg="arch.red" borderRadius="full" />
      ) : null}
    </Box>
  );
}
