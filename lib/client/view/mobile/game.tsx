import { useSnapshot } from "valtio";
import { Badge, Box, Button, For, HStack, Show, Spacer, VStack, Text, Circle, Float, Icon } from "@chakra-ui/react";
import { CiCircleCheck } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { gameViewModel, SectionContent } from "@client/viewmodel/game";
import { ClueRepresent } from "@shared/interfaces";

export function MobileGameView() {
  const viewModel = useSnapshot(gameViewModel);

  return (
    <Box padding="10px">
      <Show when={viewModel.view === "puzzle"}>
        <Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
      </Show>
      <Show when={viewModel.view === "clues"}>
        <VStack width="full" gap="25px" align="stretch" padding="10px">
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

function SectionView({section}: {section: SectionContent}) {
  const viewModel = useSnapshot(gameViewModel);

  function ClueView({clue}: {clue: ClueRepresent}) {
    if (clue.clue) {
      return (
        <Text 
          whiteSpace="pre-wrap" 
          color={viewModel.indicatedId.includes(clue.id) ? "red.500" : "fg.default"}
        >{clue.clue}</Text>
      );
    }
    return (
      <Box bg="bg.emphasized" width="full">
        <Text whiteSpace="pre-wrap" color="fg.subtle" marginLeft="10%">
          {clue.hint ? `[${clue.hint}]` : " "}
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap="6px">
      <HStack justify="start">
        <Show when={section.completed}>
          <Icon as={CiCircleCheck} color="green.500" />
        </Show>
        <Show when={section.title}>
          <Text fontWeight="bold">{section.title}</Text>
        </Show>
      </HStack>
      <For each={section.items}>
        {(clue, index) => (
          <ClueView key={index} clue={clue} />
        )}
      </For>
    </VStack>
  )
}

function PanelView() {
  const viewModel = useSnapshot(gameViewModel);
  const router = useRouter();

  return (
    <VStack width="full" gap="8px" align="stretch">
      <HStack>
        <Badge 
          size="lg"
          variant={viewModel.view === "puzzle" ? "solid" : "outline"}
          onClick={() => { gameViewModel.view = "puzzle"; }}
        >谜面</Badge>
        <Box position="relative">
          <Badge 
            size="lg"
            variant={viewModel.view === "clues" ? "solid" : "outline"}
            onClick={() => { 
              gameViewModel.view = "clues"; 
              gameViewModel.indicated = false;
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
            gameViewModel.endGame(); 
            router.push('/');
          }}
        >结束游戏</Badge>
      </HStack>
      <HStack>
        <IMESafeInput
          type="textarea"
          value={viewModel.input}
          onChange={(newValue) => (gameViewModel.input = newValue)}
          textareaProps={{
            onKeyDown: (e) => {
              if (e.key === 'Enter' && !e.shiftKey && viewModel.input.trim() !== '') {
                e.preventDefault();
                gameViewModel.submit();
              }
            }
          }}
        />
        <Button onClick={() => gameViewModel.submit()}>提交</Button>
      </HStack>
    </VStack>
  );
}
