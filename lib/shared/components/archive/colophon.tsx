"use client";

import { Flex, chakra } from "@chakra-ui/react";
import { BracketLink } from "./action";

/** 报尾 · 版权 + 出处。 */
export function Colophon() {
  return (
    <Flex
      as="footer"
      align="center"
      wrap="wrap"
      gap="8px 22px"
      fontFamily="mono"
      fontSize="11.5px"
      letterSpacing="0.5px"
      color="arch.mut"
      py="20px"
      pb="56px"
      mt="26px"
      borderTop="2px solid"
      borderColor="arch.rule"
    >
      <chakra.span display="inline-flex" alignItems="baseline" gap="6px" flexWrap="wrap">
        © 2025 MistCase(迷雾档案) by
        <BracketLink external href="https://deepclue.app" fontSize="11.5px">
          DeepClue ↗
        </BracketLink>
      </chakra.span>
      <chakra.span flex="1" />
    </Flex>
  );
}
