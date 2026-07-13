"use client";

import { Box, Flex, For, Link as ChakraLink, chakra } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSnapshot } from "valtio";
import { NovelListItem, novelViewModel } from "../novel/viewmodel";
import { Masthead } from "@lib/shared/components/archive/masthead";
import { SectionHead } from "@lib/shared/components/archive/section-head";
import { Colophon } from "@lib/shared/components/archive/colophon";

export function LabListView() {
  return (
    <Box maxW="1360px" mx="auto" px={{ base: "20px", md: "32px" }} minH="100vh">
      <Masthead current="lab" title="迷雾档案：实验室" />
      <ComposeSection />
      <NovelSection />
      <Colophon />
    </Box>
  );
}

const composes = [
  { id: "compose-01", title: "P01 广场上的枪声", description: "市长遭瞄准之际，狙击手却神秘倒下，枪声未响，真相暗涌" },
  { id: "compose-02", title: "P02 沉默的祝酒词", description: "毒酒未入口，侍者却被枪击倒地；教父大寿之夜的暗杀在爆响中逆转" },
];

function ComposeSection() {
  return (
    <Box as="section">
      <Flex align="baseline" gap="14px" pt="30px" pb="14px" borderBottom="1px solid" borderColor="arch.rule">
        <chakra.h3 fontFamily="serif" fontWeight="600" fontSize="22px" letterSpacing="3px" m="0" color="arch.ink">
          蝴蝶效应
        </chakra.h3>
        <chakra.span
          fontFamily="mono"
          fontSize="10px"
          letterSpacing="1.5px"
          color="arch.brass"
          border="1px solid"
          borderColor="arch.brass"
          px="7px"
          py="2px"
          textTransform="uppercase"
        >
          Beta
        </chakra.span>
      </Flex>
      <chakra.p
        fontFamily="serif"
        fontSize="13.5px"
        color="arch.dim"
        lineHeight="1.95"
        maxW="66ch"
        m="16px 0 22px"
        whiteSpace="pre-line"
        borderLeft="2px solid"
        borderColor="arch.rule"
        pl="16px"
      >
        {`失败并非不可避免，你的一个小改变可能会改变整个故事的走向。\n在《蝴蝶效应》中，你可以选择故事中的一个片段进行改写，看看故事会如何发展下去。\n你的目标是让原本没有发生的事件发生，或者让已经发生的事件不再发生。`}
      </chakra.p>
      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(auto-fit, minmax(320px, 1fr))" }} border="1px solid" borderColor="arch.rule">
        <For each={composes}>
          {(item, index) => (
            <ChakraLink
              key={item.id}
              asChild
              color="inherit"
              _hover={{ textDecoration: "none", bg: "arch.hov" }}
              transition="background 0.15s"
              display="block"
              borderRight={{ base: "none", md: index % 2 === 0 ? "1px solid" : "none" }}
              borderColor="arch.rule"
            >
              <NextLink href={`/compose/${item.id}`}>
                <Box px="24px" py="22px">
                  <chakra.h4 fontFamily="serif" fontWeight="700" fontSize="20px" letterSpacing="1px" m="0 0 9px" color="arch.ink">
                    {item.title}
                  </chakra.h4>
                  <chakra.p fontFamily="serif" fontSize="13px" color="arch.dim" lineHeight="1.85" m="0">
                    {item.description}
                  </chakra.p>
                  <Flex justify="flex-end" mt="14px" fontFamily="mono" fontSize="11px" letterSpacing="1px">
                    <chakra.span color="arch.brass" whiteSpace="nowrap">[进入]</chakra.span>
                  </Flex>
                </Box>
              </NextLink>
            </ChakraLink>
          )}
        </For>
      </Box>
    </Box>
  );
}

function NovelSection() {
  const viewModel = useSnapshot(novelViewModel);
  return (
    <Box as="section" mt="10px">
      <SectionHead title="AIGC 推理实验室" />
      <chakra.p
        fontFamily="serif"
        fontSize="13.5px"
        color="arch.dim"
        lineHeight="1.95"
        maxW="66ch"
        m="16px 0 20px"
        whiteSpace="pre-line"
        borderLeft="2px solid"
        borderColor="arch.rule"
        pl="16px"
      >
        {`迷雾档案 AIGC 实验室是一个专注于 AI 生成推理故事的展示平台。我们会分析推理故事的一般结构，并利用 AI 技术生成尽可能精彩的推理谜题和故事。\n每一篇故事都会标注我们估计的「AI 参与比例」，以帮助读者了解 AI 在创作过程中的作用。`}
      </chakra.p>
      <For each={viewModel.list}>{(item) => <NovelRow key={item.id} item={item} />}</For>
    </Box>
  );
}

function NovelRow({ item }: { item: NovelListItem }) {
  const meta = [
    ...item.tags,
    item.aiRate ? `AI 参与度 ${item.aiRate}` : null,
    item.author ? `作者 ${item.author}` : null,
    item.duration,
  ].filter(Boolean).join(" · ");
  return (
    <ChakraLink asChild color="inherit" _hover={{ textDecoration: "none" }} display="block">
      <NextLink href={`/lab/novel/${item.id}`}>
        <Flex
          align="baseline"
          justify="space-between"
          gap="12px"
          wrap="wrap"
          py="12px"
          borderBottom="1px dotted"
          borderColor="arch.ruleSoft"
          transition="background 0.15s"
          _hover={{ bg: "arch.hov" }}
        >
          <chakra.span fontFamily="serif" fontWeight="700" fontSize="16px" letterSpacing="0.5px" color="arch.ink">
            {item.title}
          </chakra.span>
          <chakra.span fontFamily="mono" fontSize="10.5px" letterSpacing="1px" color="arch.mut">
            {meta}
          </chakra.span>
        </Flex>
      </NextLink>
    </ChakraLink>
  );
}
