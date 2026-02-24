"use client";

import { Container, VStack, SimpleGrid, GridItem, ScrollArea, HStack, Spacer, Button, For, Text, Show, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import { useSnapshot } from "valtio";
import { Prose } from "@lib/shared/components/ui/prose";
import { IMESafeInput } from "@lib/shared/components/IMESafeInput";
import { LoadingView } from "@lib/shared/components/LoadingView";
import { detectViewModel } from "@lib/detect/viewmodel";
import { GameRating } from "@lib/shared/components/GameRating";

export function DesktopDetectView() {
  return (
    <Container maxW="container.lg" height="100vh">
      <VStack width="full" height="full" align="stretch" gap="10px" paddingY="20px">
        <SimpleGrid columns={2} gap={4}>
          <GridItem>
            <CaseView />
          </GridItem>
          <GridItem>
            <LogsView />
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

function CaseView() {
  const viewModel = useSnapshot(detectViewModel);
  return (
    <ScrollArea.Root height="95vh" size="sm" variant="always">
      <ScrollArea.Viewport>
        <ScrollArea.Content paddingEnd="5">
          <Prose color="fg">
            <Markdown>{viewModel.puzzle}</Markdown>
          </Prose>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

function LogsView() {
  const viewModel = useSnapshot(detectViewModel);
  const router = useRouter();
  return (
    <ScrollArea.Root height="95vh" size="sm" variant="always">
      <ScrollArea.Viewport>
        <ScrollArea.Content paddingEnd="5">
          <VStack align="stretch" width="full" gap="10px">
            <HStack position="sticky" top={0} zIndex={1} bg="bg">
              <Spacer />
              <Button
                size="sm" colorPalette="red" variant="surface"
                disabled={!viewModel.currentQuestion}
                onClick={async () => {
                  detectViewModel.skip();
                }}
              >跳过当前问题</Button>
              <Button
                size="sm" colorPalette="red" variant="surface"
                onClick={() => {
                  detectViewModel.endGame()
                  router.push("/");
                }}
              >结束游戏</Button>
            </HStack>
            <For each={viewModel.logs}>
              {(log, index) => (
                <VStack key={index} align="start">
                  <Text fontWeight="bold">Q: {log.question}</Text>
                  <Prose color="fg">
                    <Markdown>{log.answer}</Markdown>
                  </Prose>
                </VStack>
              )}
            </For>
            <Spacer minH="20px" />
            <Box position="sticky" bottom={0} bg="bg.emphasized" padding="10px" borderRadius="10px">
              <PanelView />
            </Box>
          </VStack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

function PanelView() {
  const viewModel = useSnapshot(detectViewModel);
  const router = useRouter();

  if (!viewModel.currentQuestion && viewModel.story) {
    return (
      <VStack width="full" align="stretch" gap="10px">
        <Prose color="fg">
          <Markdown>{viewModel.story}</Markdown>
        </Prose>
        <GameRating game="detect" targetId={viewModel.id} />
        <HStack justify="end">
          <Button
            colorPalette="red" variant="surface"
            onClick={() => {
              detectViewModel.endGame();
              router.push("/");
            }}
          >结束游戏</Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack width="full" align="stretch" gap="10px">
      <HStack align="start">
        <Text whiteSpace="nowrap">{viewModel.currentIndex}</Text>
        <Show when={viewModel.currentQuestion}>
          <Text>{viewModel.currentQuestion}</Text>
        </Show>
      </HStack>
      <Show when={viewModel.correctFlag && !!viewModel.standardAnswer}>
        <VStack align="stretch" gap="10px">
          <Text color="green.500" fontWeight="bold">回答正确！</Text>
          <Prose color="fg">
            <Markdown>{viewModel.standardAnswer}</Markdown>
          </Prose>
          <HStack>
            <Button colorPalette="blue" onClick={() => detectViewModel.nextQuestion()}>下一题</Button>
          </HStack>
        </VStack>
      </Show>

      <Show when={!viewModel.correctFlag}>
        <Show when={viewModel.wrongFlag}>
          <Text color="red.500">回答错误 ({viewModel.percentage} / 100)</Text>
          <Show when={viewModel.hint}>
            <Text color="red.400">{viewModel.hint}</Text>
          </Show>
        </Show>
        <Show when={!!viewModel.currentQuestion}>
          <HStack align="start">
            <IMESafeInput
              type="textarea"
              value={viewModel.input}
              onChange={(newValue) => (detectViewModel.input = newValue)}
              textareaProps={{
                onKeyDown: (e) => {
                  if (e.key === 'Enter' && !e.shiftKey && viewModel.input.trim() !== '') {
                    e.preventDefault();
                    detectViewModel.submit();
                  }
                },
                borderColor: 'fg.muted',
              }}
            />
            <Button
              disabled={!viewModel.interactable || viewModel.input.trim() === ''}
              onClick={() => detectViewModel.submit()}
            >
              <Show when={!viewModel.interactable}>
                <LoadingView />
              </Show>
              <Text>提交</Text>
            </Button>
          </HStack>
        </Show>
      </Show>
    </VStack>
  );
}
