"use client";

import { Button, Card, Container, For, Heading, HStack, Show, Spacer, VStack, Text, Wrap, Badge, SimpleGrid } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import { useState } from "react";
import Link from "next/link";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { listViewModel } from "@client/viewmodel/list";
import { StoryItem } from "@/lib/shared/interfaces";

export function ListView() {
  const viewModel = useSnapshot(listViewModel);
  const [story, setStory] = useState("");

  return (
    <Container maxW="3xl" height="100vh">
      <VStack height="full" align="stretch" paddingY="20px">
        <Heading paddingY="20px">迷你推理 Demo</Heading>
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
        <HStack>
          <IMESafeInput
            type="textarea"
            value={story}
            onChange={(newValue) => setStory(newValue)}
          />
          <Link href="/custom">
            <Button onClick={() => listViewModel.load(story)}>
              Load Story
            </Button>
          </Link>
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
