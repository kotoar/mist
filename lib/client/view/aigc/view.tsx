"use client";

import { Blockquote, Container, Heading, HStack, Image, VStack, Text, Spacer, Show, For, Badge, useBreakpointValue } from "@chakra-ui/react";
import { NovelListItem, novelViewModel } from "./viewmodel";
import { useSnapshot } from "valtio";
import Link from "next/link";

export function AigcListView() {
  const viewModel = useSnapshot(novelViewModel);

  return (
    <Container maxW="3xl" height="100vh">
      <VStack align="stretch" height="full" gap="20px" padding="20px">
        <Banner />
        <For each={viewModel.list}>
          {(item) => (
            <Link key={item.id} href={`/aigc/${item.id}`}>
              <ListItemView item={item} />
            </Link>
          )}
        </For>
      </VStack>
    </Container>
  );
}

function Banner() {
  return (
    <VStack gap="10px" align="stretch" paddingBottom="10px">
      <HStack position="sticky" top="0" align="center" width="full" gap="10px" bg="bg" zIndex={1} py="10px">
        <Image src="/lab-icon.png" alt="Logo:Lab" boxSize="50px" />
        <Heading size="2xl">迷雾档案：AIGC 推理实验室</Heading>
      </HStack>
      <Blockquote.Root>
        <Blockquote.Content whiteSpace="pre-wrap" color="fg.muted" fontSize="sm">
          迷雾档案AIGC实验室是一个专注于AI生成推理故事的展示平台。我们会分析推理故事的一般结构，并利用AI技术生成尽可能精彩的推理谜题和故事。
          {`\n`}
          目前来看，AI在创作推理故事时仍然面临诸多挑战，不可避免的会在很多地方，特别是核心诡计和整体行文方面不得不人工参与。
          {`\n`}{`\n`}
          在这里，每一篇故事都会标注我们估计的「AI参与比例」，以帮助读者了解AI在创作过程中的作用。
          {`\n`}
          对于其中我们觉得满意的故事，我们会将其纳入迷雾档案的正式档案库中。成为大家“摸鱼”时候的素材。而高质量的饱含人工巧思的正经出版物，则可以留到有精力的整段的时间来慢慢品味。
        </Blockquote.Content>
      </Blockquote.Root>
    </VStack>
  );
}

function ListItemView({ item }: { item: NovelListItem}) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <VStack align="stretch" gap="5px" padding="10px" bg="bg.emphasized" borderRadius="md">
        <HStack>
          <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
          <HStack gap="5px" flexWrap="wrap">
            <For each={item.tags}>
              {(tag) => (
                <Badge key={tag}>{tag}</Badge>
              )}
            </For>
          </HStack>
        </HStack>
        <HStack>
          <Text fontSize="sm" color="fg.muted">AI参与度：{item.aiRate}</Text>
          <Show when={item.author}>
            <Text fontSize="sm" color="fg.muted">作者：{item.author}</Text>
          </Show>
          <Spacer />
          <Text fontSize="sm" color="fg.muted">{item.duration}</Text>
        </HStack>
      </VStack>
    );
  } else {
    return (
      <HStack width="full" align="stretch" gap="5px" padding="10px" bg="bg.emphasized" borderRadius="md">
        <Text fontWeight="bold">{item.title}</Text>
        <For each={item.tags}>
          {(tag) => (
            <Badge key={tag}>{tag}</Badge>
          )}
        </For>
        <Text fontSize="sm" color="fg.muted">{item.duration}</Text>
        <Spacer />
        <Text fontSize="sm" color="fg.muted">AI参与度：{item.aiRate}</Text>
        <Show when={item.author}>
          <Text fontSize="sm" color="fg.muted">作者：{item.author}</Text>
        </Show>
      </HStack>
    );
  }
}
