"use client";

import { Card, Container, Image, For, Heading, HStack, Show, Spacer, VStack, Text, Wrap, Badge, SimpleGrid, Box, Link as ChakraLink, Highlight } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import Link from "next/link";
import { listViewModel } from "@client/viewmodel/list";
import { CasePreview } from "@/lib/shared/case-schema";
import { CommunityView } from "./community";

export function HomeView() {
  const viewModel = useSnapshot(listViewModel);
  
  return (
    <Container maxW="3xl" height="100vh">
      <VStack height="full" align="stretch" paddingTop="20px" gap="20px">
        <HStack position="sticky" top={0} zIndex={1} bg="bg" marginBottom="20px">
          <Image src="/icon.png" alt="Logo" boxSize="50px" />
          <TitleView />
        </HStack>
        <SimpleGrid columns={2} gap={4}>
          <For each={viewModel.items}>
            {(item) => (
              <Link key={item.id} href={`/game/${item.id}`}>
                <CaseView item={item} />
              </Link>
            )}
          </For>
        </SimpleGrid>
        <Spacer />
        <VStack align="start" position="sticky" bottom={0} bg="bg" gap="2px">
          <CommunityView />
          <HStack paddingY="10px" gap="10px">
            <Text fontSize="sm">
              © 2025 MistCase by{" "}
              <ChakraLink colorPalette="cyan" fontSize="sm" asChild>
                <Link href="https://deepclue.app" target="_blank" rel="noopener noreferrer">
                  DeepClue
                </Link>
              </ChakraLink>
            </Text>
            <Text fontSize="sm">v0.0.1-alpha</Text>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
}

function CaseView(props: {item: CasePreview}) {
  const { item } = props;
  return (
    <Card.Root size={{ md: "md", base: "sm" }}height="full">
      <Card.Body>
        <VStack align="stretch" justify="space-between" gap="4px" height="full">
          <Heading size={{ md: "md", base: "sm" }}>{item.title}</Heading>
          <Wrap>
            <For each={item.tags}>
              {(tag) => (
                <Badge key={tag} colorPalette={tagColor(tag)} size={{ md: "sm", base: "xs" }}>
                  {tag}
                </Badge>
              )}
            </For>
            <Spacer />
            <Show when={item.author}>
              <Text color="gray.500" fontSize={{ md: "sm", base: "xs" }}>作者：{item.author}</Text>
            </Show>
          </Wrap>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

function TitleView() {
  const viewModel = useSnapshot(listViewModel);

  if (viewModel.type === "case") {
    return (
      <Box>
        <Heading size="2xl">
          <Highlight query="档案" styles={{ px: "0.5", bg: { _light: "teal.200", _dark: "teal.700" } }}>
            迷雾档案
          </Highlight>
        </Heading>
        <Text>侦探们的摸鱼神器</Text>
      </Box>
    );
  } else {
    return (
      <Box>
        <Heading size="2xl">
          <Highlight query="迷雾" styles={{ px: "0.5", bg: { _light: "purple.200", _dark: "purple.700" } }}>
            迷雾档案
          </Highlight>
        </Heading>
        <Highlight 
          query={["神祇", "消遣"]} 
          styles={{ 
            px: "0.5", 
            bg: "fg",
          }}
        >
          神祇们的消遣神器
        </Highlight>
      </Box>
    );
  }
}

type TagColor = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
const colorList: TagColor[] = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'];
function tagColor(tag: string): TagColor {
  const hash = Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorList[hash % colorList.length];
}
