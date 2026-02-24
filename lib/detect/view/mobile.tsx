"use client";

import { VStack, HStack, Spacer, Button, For, Text, Show, Box, Badge } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";
import { useSnapshot } from "valtio";
import { Prose } from "@lib/shared/components/ui/prose";
import { detectViewModel } from "@lib/detect/viewmodel";
import { DetectDelegate } from "@lib/detect/model";
import { IMESafeInput } from "@lib/shared/components/IMESafeInput";
import { LoadingView } from "@lib/shared/components/LoadingView";

export function MobileDetectView() {
  const viewModel = useSnapshot(detectViewModel);
  const router = useRouter();
  return (
    <VStack width="full" height="full" align="stretch">
      <HStack position="sticky" top={0} zIndex={1} bg="bg.emphasized" paddingX="10px" paddingY="8px">
        <Text fontWeight="bold">{viewModel.title}</Text>
        <Spacer />
        <Show when={!!viewModel.currentQuestion}>
          <Badge
            size="lg" colorPalette="orange" variant="surface"
            onClick={async () => {
              detectViewModel.skip();
            }}
          >跳过当前问题</Badge>
        </Show>
        <Badge
          size="lg" colorPalette="red" variant="surface"
          onClick={() => {
            detectViewModel.endGame()
            router.push("/");
          }}
        >结束游戏</Badge>
      </HStack>
      <Show when={viewModel.view === "puzzle"}>
        <CaseView />
      </Show>
      <Show when={viewModel.view === "logs"}>
        <LogsView />
      </Show>
      <VStack position="fixed" bottom={0} width="full" padding="10px" gap="10px" align="stretch" bg="bg.emphasized">
        <HStack>
          <Badge
            size="lg"
            variant={viewModel.view === "puzzle" ? "solid" : "subtle"}
            onClick={() => (detectViewModel.view = "puzzle")}
          >案件</Badge>
          <Badge
            size="lg"
            variant={viewModel.view === "logs" ? "solid" : "subtle"}
            onClick={() => (detectViewModel.view = "logs")}
          >调查笔记</Badge>
        </HStack>
        <PanelView />
      </VStack>
    </VStack>
  );
}

function CaseView() {
  const viewModel = useSnapshot(detectViewModel);
  return (
    <VStack paddingX="10px">
      <Prose color="fg">
        <Markdown>{viewModel.puzzle}</Markdown>
      </Prose>
      <Box height="500px" />
    </VStack>
  );
}

function LogsView() {
  const viewModel = useSnapshot(detectViewModel);
  return (
    <VStack align="stretch" width="full" gap="10px" paddingX="10px">
      <For each={viewModel.logs}>
        {(log, index) => (
          <VStack key={index} align="start">
            <Text fontWeight="bold">{log.question}</Text>
            <Prose color="fg">
              <Markdown>{log.answer}</Markdown>
            </Prose>
          </VStack>
        )}
      </For>
      <Box height="500px" />
    </VStack>
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
          <Text color="green.500" fontWeight="bold">回答正确！标准答案：</Text>
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
          <Text color="red.500">回答错误，可以再试一试。(接近程度: {viewModel.percentage} / 100)</Text>
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
