"use client";

import { Blockquote, Container, HStack, VStack, Text, Spacer, Show, For, Badge, useBreakpointValue, Button, Heading, Card, Wrap, Box, SimpleGrid } from "@chakra-ui/react";
import { NovelListItem, novelViewModel } from "../novel/viewmodel";
import { PageTitleView } from "@client/view/components/title";
import { useSnapshot } from "valtio";
import Link from "next/link";

export function LabListView() {
  return (
    <Container maxW="6xl" height="100vh">
      <VStack align="stretch" height="full" gap="20px" padding="20px">
        <HStack>
          <PageTitleView type="lab" />
          <Spacer />
          <Link href="/" passHref>
            <Button size={{ md: "sm", base: "xs" }} colorPalette="orange" variant="surface">主页</Button>
          </Link>
        </HStack>
        <ComposeSection />
        <Box height="1px" bg="bg.emphasized" />
        <NovelSection />
      </VStack>
    </Container>
  );
}

function ComposeSection() {
  return (
    <VStack align="stretch" width="full" gap="10px">
      <HStack>
        <Heading size="lg">蝴蝶效应</Heading>
        <Badge colorPalette="blue">Beta</Badge>
      </HStack>
      <Blockquote.Root>
        <Blockquote.Content whiteSpace="pre-wrap" color="fg.muted" fontSize="sm">
          失败并非不可避免，你的一个小改变可能会改变整个故事的走向。
          {`\n`}
          在《蝴蝶效应》中，你可以选择故事中的一个片段进行改写，看看故事会如何发展下去。
          {`\n`}
          你的目标是让原本没有发生的事件发生，或者让已经发生的事件不再发生。
        </Blockquote.Content>
      </Blockquote.Root>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="10px">
        <For each={composes}>
          {(item) => (
            <Link key={item.id} href={`/compose/${item.id}`}>
              <ComposePreviewView title={item.title} description={item.description} />
            </Link>
          )}
        </For>
      </SimpleGrid>
    </VStack>
  );
}

const composes = [
  {
    id: "compose-01",
    title: "P01 广场上的枪声",
    description: "市长遭瞄准之际，狙击手却神秘倒下，枪声未响，真相暗涌",
  },
  {
    id: "compose-02",
    title: "P02 沉默的祝酒词",
    description: "毒酒未入口，侍者却被枪击倒地；教父大寿之夜的暗杀在爆响中逆转",
  }
];

interface ComposePreviewViewProps {
  title: string;
  description: string;
}
function ComposePreviewView({ title, description }: ComposePreviewViewProps) {
  return (
    <Card.Root size="sm">
      <Card.Body>
        <VStack align="start" gap="5px">
          <Heading size="md">{title}</Heading>
          <Text color="fg.subtle" fontSize="sm" whiteSpace="pre-wrap">
            {description}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function NovelSection() {
  const viewModel = useSnapshot(novelViewModel);
  return (
    <VStack align="stretch" width="full">
      <HStack>
        <Heading size="lg">AIGC 推理实验室</Heading>
      </HStack>
      <Blockquote.Root>
        <Blockquote.Content whiteSpace="pre-wrap" color="fg.muted" fontSize="sm">
          迷雾档案 AIGC 实验室是一个专注于AI生成推理故事的展示平台。我们会分析推理故事的一般结构，并利用AI技术生成尽可能精彩的推理谜题和故事。
          {`\n`}
          目前来看，AI在创作推理故事时仍然面临诸多挑战，不可避免的会在很多地方，特别是核心诡计和整体行文方面不得不人工参与。
          {`\n`}{`\n`}
          在这里，每一篇故事都会标注我们估计的「AI参与比例」，以帮助读者了解AI在创作过程中的作用。
          {`\n`}
          对于其中我们觉得满意的故事，我们会将其纳入迷雾档案的正式档案库中。成为大家“摸鱼”时候的素材。而高质量的饱含人工巧思的正经出版物，则可以留到有精力的整段的时间来慢慢品味。
        </Blockquote.Content>
      </Blockquote.Root>
      <For each={viewModel.list}>
        {(item) => (
          <Link key={item.id} href={`/lab/novel/${item.id}`}>
            <NovelListItemView item={item} />
          </Link>
        )}
      </For>
    </VStack>
  );
}

function NovelListItemView({ item }: { item: NovelListItem}) {
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
