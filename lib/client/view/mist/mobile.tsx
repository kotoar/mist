import { useSnapshot } from "valtio";
import { Badge, Box, Button, For, HStack, Show, Spacer, VStack, Text, Circle, Float } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { mistViewModel } from "@client/viewmodel/mist";
import { SectionView } from "./section";
import { MistStoryBannerView } from "./story-banner";

export function MobileMistGameView() {
  const viewModel = useSnapshot(mistViewModel);

  return (
    <Box padding="10px">
      <Show when={viewModel.view === "puzzle"}>
        <Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
      </Show>
      <Show when={viewModel.view === "clues"}>
        <VStack width="full" gap="25px" align="stretch" padding="10px">
          <Show when={viewModel.story}>
            <Box position="sticky" top={0} zIndex={1} bg="bg" paddingY="4px">
              <MistStoryBannerView />
            </Box>
          </Show>
          <For each={viewModel.sections}>
            {(section, index) => (
              <SectionView key={index} section={section} />
            )}
          </For>
          <Spacer />
        </VStack>
      </Show>
      <Box height="120px" />
      <Box position="fixed" bottom={0} left={0} right={0} bg="bg" borderTop="1px solid" borderColor="fg.subtle" padding="10px">
        <PanelView />
      </Box>
    </Box>
  );
}

function PanelView() {
  const viewModel = useSnapshot(mistViewModel);
  const router = useRouter();

  return (
    <VStack width="full" gap="8px" align="stretch">
      <HStack>
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
          <Show when={viewModel.indicated}>
            <Float placement="top-end" offsetX={1} offsetY={1}>
              <Circle size="3" bg="red" color="white" />
            </Float>
          </Show>
        </Box>
        <Show when={viewModel.showInvalid}>
          <Text color="red.500">没有新的线索显现</Text>
        </Show>
        <Spacer />
        <Badge 
          size="lg"
          colorPalette="red"
          onClick={() => { 
            mistViewModel.endGame(); 
            router.push('/');
          }}
        >结束游戏</Badge>
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
        <Button onClick={() => mistViewModel.submit()}>提交</Button>
      </HStack>
    </VStack>
  );
}
