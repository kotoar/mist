"use client";

import { Button, Container, For, Heading, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import { listViewModel } from "../viewmodel/list";
import Link from "next/link";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { useState } from "react";

export function ListView() {
  const viewModel = useSnapshot(listViewModel);
  const [story, setStory] = useState("");

  return (
    <Container maxW="container.md" height="100vh">
      <VStack width="full" height="full" align="stretch" gap="10px" paddingY="20px">
        <Heading fontSize="2xl" fontWeight="bold">Mist AI Demo</Heading>
        <For each={viewModel.items}>
          {(item) => (
            <Link key={item.id} href={`/game/${item.id}`}>
              <Button>{item.title}</Button>
            </Link>
          )}
        </For>
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
