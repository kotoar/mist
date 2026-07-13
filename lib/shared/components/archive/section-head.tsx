"use client";

import { Flex, chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** 分节标头: 衬线小标题 + 右侧可选行动, 底部 1px 分节线。 */
export function SectionHead({
  title,
  action,
  ...rest
}: {
  title: ReactNode;
  action?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Flex
      align="baseline"
      justify="space-between"
      gap="16px"
      pt="26px"
      pb="14px"
      borderBottom="1px solid"
      borderColor="arch.rule"
      {...rest}
    >
      <chakra.h3
        fontFamily="serif"
        fontWeight="600"
        fontSize="21px"
        letterSpacing="3px"
        m="0"
        color="arch.ink"
      >
        {title}
      </chakra.h3>
      {action}
    </Flex>
  );
}
