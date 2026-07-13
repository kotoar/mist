"use client";

import { Link as ChakraLink, chakra } from "@chakra-ui/react";
import NextLink from "next/link";
import { useColorMode } from "@lib/shared/components/ui/color-mode";
import type { ReactNode } from "react";

/**
 * 行动语言 · 铜色 [方括号] 链接。
 * 铁律: 凡铜必可点, 凡可点必铜, 且套 [方括号]。
 */
export function BracketLink({
  href,
  external,
  active,
  upper,
  children,
  ...rest
}: {
  href: string;
  external?: boolean;
  active?: boolean;
  upper?: boolean;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const base = {
    fontFamily: "mono",
    fontSize: "12.5px",
    letterSpacing: upper ? "1.5px" : "1px",
    color: "arch.brass",
    textDecoration: "none",
    whiteSpace: "nowrap" as const,
    px: "8px",
    py: "3px",
    borderRadius: "0",
    textTransform: upper ? ("uppercase" as const) : undefined,
    bg: active ? "arch.hov" : undefined,
    transition: "background 0.15s",
    cursor: "pointer",
    _hover: { bg: "arch.hov", textDecoration: "none" },
    ...rest,
  };

  return (
    <ChakraLink asChild {...base}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          [{children}]
        </a>
      ) : (
        <NextLink href={href}>[{children}]</NextLink>
      )}
    </ChakraLink>
  );
}

/** 暗 / 亮 主题切换按钮(报头右上) */
export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const label = colorMode === "light" ? "☀ 亮色" : "☾ 暗色";
  return (
    <chakra.button
      type="button"
      onClick={toggleColorMode}
      fontFamily="mono"
      fontSize="11px"
      color="arch.brass"
      bg="arch.panel"
      border="1px solid"
      borderColor="arch.rule"
      borderRadius="0"
      px="10px"
      py="8px"
      letterSpacing="1px"
      whiteSpace="nowrap"
      cursor="pointer"
      transition="background 0.15s"
      _hover={{ bg: "arch.hov" }}
    >
      [{label}]
    </chakra.button>
  );
}
