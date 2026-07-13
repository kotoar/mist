"use client";

import { useSnapshot } from "valtio";
import { Box, Flex, Image, Link as ChakraLink, chakra } from "@chakra-ui/react";
import NextLink from "next/link";
import { scriptViewModel } from "@lib/scripts/viewmodel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";

export function ScriptView() {
  const viewModel = useSnapshot(scriptViewModel);
  return (
    <Box maxW="900px" mx="auto" px={{ base: "20px", md: "32px" }} minH="100vh">
      <Flex
        align="center"
        justify="space-between"
        gap="16px"
        pt="24px"
        pb="14px"
        borderBottom="3px double"
        borderColor="arch.rule"
      >
        <ChakraLink asChild color="arch.ink" _hover={{ textDecoration: "none" }}>
          <NextLink href="/">
            <Flex align="center" gap="12px">
              <Image src="/icon.png" alt="迷雾档案" boxSize="30px" filter="invert(1)" _light={{ filter: "none" }} />
              <chakra.span fontFamily="serif" fontWeight="900" fontSize="20px" letterSpacing="2px">
                迷雾档案
              </chakra.span>
            </Flex>
          </NextLink>
        </ChakraLink>
        <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mut">
          推理游戏剧本
        </chakra.span>
      </Flex>
      <Box py="30px">
        <ArchiveMarkdown>{viewModel.script}</ArchiveMarkdown>
      </Box>
    </Box>
  );
}
