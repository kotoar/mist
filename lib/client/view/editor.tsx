"use client";

import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { Button, Container, HStack, Link, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { listViewModel } from "@client/viewmodel/list";

export function EditorView() {
  const [story, setStory] = useState("");
  
  return (
    <Container maxW="container.md" height="100vh">
      <VStack width="full" align="stretch">
        <HStack paddingY="10px" gap="10px">
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