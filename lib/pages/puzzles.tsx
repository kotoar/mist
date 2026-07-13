"use client";

import { Box, Flex, HStack, Image, Link as ChakraLink, chakra } from "@chakra-ui/react";
import { Masthead } from "@lib/shared/components/archive/masthead";
import { Colophon } from "@lib/shared/components/archive/colophon";

const PURPLE = "#9B7BB5";

export function PuzzleListView() {
  return (
    <Box maxW="1360px" mx="auto" px={{ base: "20px", md: "32px" }} minH="100vh">
      <Masthead current="puzzles" />

      {/* 引言 */}
      <Box as="section" py="26px 30px" pt="26px" pb="30px" borderBottom="1px solid" borderColor="arch.rule">
        <chakra.p
          fontFamily="serif"
          fontSize="14.5px"
          color="arch.dim"
          lineHeight="1.95"
          maxW="58ch"
          m="0"
          whiteSpace="pre-line"
          borderLeft="2px solid"
          borderColor="arch.rule"
          pl="16px"
        >
          {`网页解密游戏是近年来兴起的一种互动式谜题体验形式。玩家通过浏览网页、解读线索、破解密码，逐步揭开隐藏在故事背后的秘密。\n请多加使用游戏内的搜索功能，揭开作者设置的各种谜题。`}
        </chakra.p>
      </Box>

      {/* 街区卡 */}
      <Box mt="26px" border="1px solid" borderColor="arch.rule" borderLeft={`2px solid ${PURPLE}`}>
        <ChakraLink
          asChild
          color="inherit"
          _hover={{ textDecoration: "none", bg: "rgba(155,123,181,.08)" }}
          transition="background 0.15s"
          display="block"
        >
          <a href="https://street7.mistcase.app" target="_blank" rel="noopener noreferrer">
            <Flex align="stretch" wrap="wrap">
              <Box
                flex={{ base: "1 1 100%", md: "0 0 300px" }}
                w={{ base: "full", md: "300px" }}
                h={{ base: "200px", md: "auto" }}
                minH={{ md: "210px" }}
                borderRight={{ md: "1px solid" }}
                borderBottom={{ base: "1px solid", md: "none" }}
                borderColor="arch.ruleSoft"
                overflow="hidden"
              >
                <Image src="/puzzles/street7.png" alt="命栽七号街" w="full" h="full" objectFit="cover" />
              </Box>
              <Flex flex="1 1 280px" minW="0" direction="column" px="30px" py="26px">
                <Flex align="center" gap="16px" wrap="wrap" mb="14px" fontFamily="mono" fontSize="10.5px" letterSpacing="1.5px" textTransform="uppercase" color={PURPLE}>
                  <span>网页解谜</span>
                  <chakra.span color="arch.rule">|</chakra.span>
                  <chakra.span color="arch.mut">天色盐</chakra.span>
                  <chakra.span flex="1" />
                  <HStack gap="8px" color="arch.mut">
                    <chakra.span letterSpacing="1px">预计时长</chakra.span>
                    <DurationSeg filled={3} total={6} color={PURPLE} />
                    <chakra.span color="arch.ink" letterSpacing="0.5px">1–1.5h</chakra.span>
                  </HStack>
                </Flex>
                <chakra.h4 fontFamily="serif" fontWeight="700" fontSize="26px" letterSpacing="1.5px" m="0 0 12px" color="arch.ink">
                  《命栽七号街》
                </chakra.h4>
                <chakra.p fontFamily="serif" fontSize="13.5px" color="arch.dim" lineHeight="1.9" m="0" whiteSpace="pre-line">
                  {`三天前，季晚失踪了。\n你发给她的消息石沉大海，电话关机。\n直到今晚，你的邮箱里没有收到警方的立案回执，反而收到了一张来自陌生机构的电子催款单。`}
                </chakra.p>
                <Flex justify="flex-end" mt="auto" pt="18px" fontFamily="mono" fontSize="11px" letterSpacing="1px">
                  <chakra.span color="arch.brass" whiteSpace="nowrap">
                    [进入 ↗]
                  </chakra.span>
                </Flex>
              </Flex>
            </Flex>
          </a>
        </ChakraLink>
      </Box>

      <Colophon />
    </Box>
  );
}

/** 预计时长 · N/total 格填充。 */
function DurationSeg({ filled, total, color }: { filled: number; total: number; color: string }) {
  return (
    <HStack gap="3px">
      {Array.from({ length: total }).map((_, i) => (
        <chakra.span
          key={i}
          w="15px"
          h="4px"
          bg={i < filled ? color : "arch.rule"}
          display="inline-block"
        />
      ))}
    </HStack>
  );
}
