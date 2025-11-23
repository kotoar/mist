"use client";

import { Container, VStack, SimpleGrid, GridItem, ScrollArea, HStack, Spacer, Button, For, Text, Show, Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import { useSnapshot } from "valtio";
import { Prose } from "@/components/ui/prose";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { LoadingView } from "@/lib/components/LoadingView";
import { detectViewModel } from "@client/viewmodel/detect";
import { DetectDelegate } from "@client/model/detect";

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
                disabled={viewModel.currentFinished === true || viewModel.story !== undefined}
                onClick={() => DetectDelegate.instance.submit()}
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

  if (viewModel.currentFinished === undefined && viewModel.story) {
    return (
      <VStack width="full" align="stretch" gap="10px">
        <Prose color="fg">
          <Markdown>{viewModel.story}</Markdown>
        </Prose>
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
      <Show when={viewModel.currentFinished === false}>
        <Text color="red.500">回答错误，可以再试一试</Text>
      </Show>
      <Show when={viewModel.currentFinished}>
        <Prose color="fg">
          <Markdown>{viewModel.currentAnswer || ""}</Markdown>
        </Prose>
        <Button 
          alignSelf="end"
          onClick={() => DetectDelegate.instance.next()}
        >
          {viewModel.story ? "结案" : "下一题"}
        </Button>
      </Show>
      <Show when={!viewModel.currentFinished}>
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
    </VStack>
  );
}
