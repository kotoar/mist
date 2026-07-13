"use client";

import { Flex, HStack, Image, Link as ChakraLink, chakra } from "@chakra-ui/react";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { useColorMode } from "@lib/shared/components/ui/color-mode";

/** 办案界面顶部「卷宗栏」: 铭牌 + 卷宗标识 + 右侧行动区。全屏宽, 高约 52px。 */
export function GameTopbar({ label, actions }: { label?: string; actions?: ReactNode }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap="12px"
      px={{ base: "14px", md: "24px" }}
      py="13px"
      borderBottom="1px solid"
      borderColor="arch.rule"
      minH="52px"
    >
      <Flex align="center" minW={0}>
        <ChakraLink asChild color="arch.ink" _hover={{ textDecoration: "none" }} flexShrink={0}>
          <NextLink href="/">
            <HStack gap="10px">
              <Image
                src="/icon.png"
                alt="迷雾档案"
                boxSize="26px"
                filter="invert(1)"
                _light={{ filter: "none" }}
              />
              <chakra.span
                fontFamily="serif"
                fontWeight="900"
                fontSize="18px"
                letterSpacing="2px"
                display={{ base: "none", sm: "inline" }}
              >
                迷雾档案
              </chakra.span>
            </HStack>
          </NextLink>
        </ChakraLink>
        {label ? (
          <chakra.span
            fontFamily="mono"
            fontSize="12px"
            color="arch.mut"
            letterSpacing="1px"
            pl="16px"
            ml="16px"
            borderLeft="1px solid"
            borderColor="arch.rule"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {label}
          </chakra.span>
        ) : null}
      </Flex>
      <HStack gap={{ base: "4px", md: "10px" }} flexShrink={0}>
        {actions}
      </HStack>
    </Flex>
  );
}

/** 卷宗栏 / 面板里的铜色 [方括号] 行动按钮。danger=朱红(结束游戏等)。 */
export function GameAction({
  onClick,
  href,
  danger,
  disabled,
  children,
}: {
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  const color = disabled ? "arch.mut" : danger ? "arch.red" : "arch.brass";
  const style = {
    fontFamily: "mono",
    fontSize: "11px",
    letterSpacing: "1px",
    color,
    background: "transparent",
    border: "0",
    padding: "4px 6px",
    whiteSpace: "nowrap" as const,
    cursor: disabled ? "default" : "pointer",
    transition: "background 0.15s",
    textDecoration: "none",
    _hover: disabled ? {} : { background: "arch.hov" },
  };

  if (href) {
    return (
      <ChakraLink asChild {...style}>
        <NextLink href={href}>[{children}]</NextLink>
      </ChakraLink>
    );
  }
  return (
    <chakra.button type="button" onClick={disabled ? undefined : onClick} {...style}>
      [{children}]
    </chakra.button>
  );
}

/** 卷宗栏里的暗/亮切换(无边铜色 [方括号] 版)。 */
export function GameThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <GameAction onClick={toggleColorMode}>
      {colorMode === "light" ? "☀ 亮色" : "☾ 暗色"}
    </GameAction>
  );
}
