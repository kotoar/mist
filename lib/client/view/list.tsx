"use client";

import { Card, Container, Image, For, Heading, HStack, Show, Spacer, VStack, Text, Wrap, Badge, SimpleGrid, Box, Link as ChakraLink } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import Link from "next/link";
import { listViewModel } from "@client/viewmodel/list";
import { StoryItem } from "@shared/interfaces";

export function ListView() {
  const viewModel = useSnapshot(listViewModel);
  

  return (
    <Container maxW="3xl" height="100vh">
      <VStack height="full" align="stretch" paddingTop="20px" gap="20px">
        <HStack position="sticky" top={0} zIndex={1} bg="bg" marginBottom="20px">
          <Image src="/icon.png" alt="Logo" boxSize="50px" />
          <Box>
            <Heading fontSize="2xl">迷雾档案</Heading>
            <Text>侦探们的摸鱼神器</Text>
          </Box>
        </HStack>
        <SimpleGrid columns={2} gap={4}>
          <For each={viewModel.items}>
            {(item) => (
              <Link key={item.id} href={`/game/${item.id}`}>
                <StoryView item={item} />
              </Link>
            )}
          </For>
        </SimpleGrid>
        <Spacer />
        <HStack position="sticky" bottom={0} bg="bg" paddingY="10px" gap="10px">
          <Text fontSize="sm">
            © 2025 MistCase by{" "}
            <ChakraLink colorPalette="cyan" fontSize="sm" asChild>
              <Link href="https://deepclue.app" target="_blank" rel="noopener noreferrer">
                DeepClue
              </Link>
            </ChakraLink>
          </Text>
          <Text fontSize="sm">v0.0.1-alpha</Text>
          <Show when={process.env.NEXT_PUBLIC_BUILD !== "prod"}>
            <ChakraLink asChild>
              <Link href="/editor">
                <Text fontSize="sm" color="red.500">Editor</Text>
              </Link>
            </ChakraLink>
          </Show>
          <Spacer />
        </HStack>
      </VStack>
    </Container>
  );
}

function StoryView(props: {item: StoryItem}) {
  const { item } = props;
  return (
    <Card.Root size="md" height="full">
      <Card.Body>
        <VStack align="stretch" gap="4px" height="full">
          <Heading>{item.title}</Heading>
          <Spacer minHeight="4px" />
          <Show when={item.description}>
            <Text>{item.description}</Text>
          </Show>
          <Wrap>
            <For each={item.tags}>
              {(tag) => (
                <Badge key={tag} colorPalette={tagColor(tag)}>
                  {tag}
                </Badge>
              )}
            </For>
            <Spacer />
            <Show when={item.author}>
              <Text color="gray.500" fontSize="sm">作者：{item.author}</Text>
            </Show>
          </Wrap>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

type TagColor = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
const colorList: TagColor[] = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'];
function tagColor(tag: string): TagColor {
  const hash = Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorList[hash % colorList.length];
}
