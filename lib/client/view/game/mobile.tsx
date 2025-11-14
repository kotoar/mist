import { useSnapshot } from "valtio";
import { useRouter } from "next/navigation";
import { For, HStack, Show, VStack, Text, Heading, Badge, Spacer } from "@chakra-ui/react";
import { gameViewModel } from "@client/viewmodel/game";
import { QuestionView } from "./question";
import { StoryBannerView } from "./story-banner";
import { InfoView } from "../info";

export function MobileGameView() {
  const viewModel = useSnapshot(gameViewModel);
  const router = useRouter();

  return (
    <VStack padding="10px" align="stretch" gap="10px">
      <HStack width="full" position="sticky" top={0} bg="bg" zIndex={1} paddingBottom="10px">
        <Heading fontSize="lg" fontWeight="bold">{viewModel.title}</Heading>
        <Badge
          size="lg"
          variant={viewModel.view === "puzzle" ? "solid" : "subtle"}
          cursor="pointer"
          onClick={() => { gameViewModel.view = "puzzle"; }}
        >案件</Badge>
        <Badge
          size="lg"
          variant={viewModel.view === "clues" ? "solid" : "subtle"}
          cursor="pointer"
          onClick={() => { gameViewModel.view = "clues"; }}
        >推理</Badge>
        <Spacer />
        <InfoView size="xs" />
        <Badge
          size="lg"
          colorPalette="red"
          cursor="pointer"
          onClick={() => { 
            gameViewModel.endGame();
            router.push("/")
          }}
        >结束游戏</Badge>
      </HStack>
      <Show when={viewModel.view === "puzzle"}>
        <Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
      </Show>
      <Show when={viewModel.view === "clues"}>
        <VStack width="full" gap="25px" align="stretch" padding="10px">
          <For each={viewModel.questions}>
            {(_, index) => (
              <QuestionView key={index} question={gameViewModel.questions[index]} />
            )}
          </For>
          <StoryBannerView />
        </VStack>
      </Show>
    </VStack>
  );
}
