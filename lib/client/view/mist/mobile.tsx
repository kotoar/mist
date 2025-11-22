"use client";

import { useSnapshot } from "valtio";
import { Badge, Box, Button, For, HStack, Show, Spacer, VStack, Text, Circle, Float, Switch } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { LoadingView } from "@/lib/components/LoadingView";
import { mistViewModel } from "@client/viewmodel/mist";
import { SectionView } from "./section";
import { MistStoryBannerView } from "./story-banner";
import { MistInfoView } from "@client/view/info";

export function MobileMistGameView() {
  const viewModel = useSnapshot(mistViewModel);
  const router = useRouter();

  return (
    <VStack align="stretch" padding="10px">
      <HStack position="sticky" top={0} bg="bg.emphasized" zIndex={1} gap="4px" paddingX="4px" paddingY="6px">
        <Text fontWeight="bold">{viewModel.title}</Text>
        <Spacer />
        <MistInfoView size="2xs" />
        <Badge 
          size="lg"
          colorPalette="pink"
          onClick={() => mistViewModel.skip()}
        >我想看答案</Badge>
        <Badge 
          size="lg"
          colorPalette="red"
          onClick={() => { 
            mistViewModel.endGame(); 
            router.push('/');
          }}
        >结束游戏</Badge>
      </HStack>
      <Show when={viewModel.view === "puzzle"}>
        <Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
      </Show>
      <Show when={viewModel.view === "clues"}>
        <VStack width="full" gap="25px" align="stretch" padding="10px">
          <Switch.Root
            size="sm"
            checked={viewModel.showMistHints}
            onCheckedChange={(e) => mistViewModel.showMistHints = e.checked}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>显示思路方向</Switch.Label>
          </Switch.Root>
          <For each={viewModel.sections}>
            {(section, index) => (
              <SectionView key={index} section={section} />
            )}
          </For>
          <Spacer />
        </VStack>
      </Show>
      <Box height={ viewModel.story ? "185px" : "120px"} />
      <Box position="fixed" bottom={0} left={0} right={0} bg="bg" borderTop="1px solid" borderColor="fg.subtle" padding="10px">
        <PanelView />
      </Box>
    </VStack>
  );
}

function PanelView() {
  const viewModel = useSnapshot(mistViewModel);

  return (
    <VStack width="full" gap="8px" align="stretch">
      <Show when={viewModel.story}>
        <MistStoryBannerView />
      </Show>
      <HStack align="end">
        <Badge 
          size="lg"
          variant={viewModel.view === "puzzle" ? "solid" : "outline"}
          onClick={() => { mistViewModel.view = "puzzle"; }}
        >谜面</Badge>
        <Box position="relative">
          <Badge 
            size="lg"
            variant={viewModel.view === "clues" ? "solid" : "outline"}
            onClick={() => { 
              mistViewModel.view = "clues"; 
              mistViewModel.indicated = false;
            }}
          >线索</Badge>
          <Spacer />
          <Show when={viewModel.indicated}>
            <Float placement="top-end" offsetX={1} offsetY={1}>
              <Circle size="3" bg="red" color="white" />
            </Float>
          </Show>
        </Box>
        <Spacer />
        <Show when={viewModel.message}>
          <Text color="red.500">{viewModel.message}</Text>
        </Show>
        <Text color="red.500" whiteSpace="nowrap">( {viewModel.count} )</Text>
      </HStack>
      <HStack>
        <IMESafeInput
          type="textarea"
          value={viewModel.input}
          onChange={(newValue) => (mistViewModel.input = newValue)}
          textareaProps={{
            onKeyDown: (e) => {
              if (e.key === 'Enter' && !e.shiftKey && viewModel.input.trim() !== '') {
                e.preventDefault();
                mistViewModel.submit();
              }
            }
          }}
        />
        <Button
          disabled={!viewModel.interactable || viewModel.input.trim() === ''}
          onClick={() => mistViewModel.submit()}
        >
          <Show when={!viewModel.interactable}>
            <LoadingView />
          </Show>
          <Text>提交</Text>
        </Button>
      </HStack>
    </VStack>
  );
}
