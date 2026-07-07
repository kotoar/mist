"use client";

import { Flex, For, VStack, chakra, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { gameViewModel } from "@lib/case/viewmodel";
import { QuestionView } from "./question";
import { StoryBannerView } from "./story-banner";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { MobileGameScreen, Tab } from "@lib/shared/components/archive/game-layout";
import { GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";
import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export function MobileGameView() {
  const viewModel = useSnapshot(gameViewModel);
  const router = useRouter();
  const solved = viewModel.questions.filter((q) => !!q.answer).length;

  if (viewModel.status !== "ready") {
    return <GameStateNotice status={viewModel.status} />;
  }

  return (
    <MobileGameScreen
      label={`${viewModel.title} · 演绎`}
      actions={
        <>
          <GameThemeToggle />
          <GameAction danger onClick={() => { gameViewModel.endGame(); router.push("/"); }}>
            结束
          </GameAction>
        </>
      }
      content={
        <Show
          when={viewModel.view === "puzzle"}
          fallback={
            <VStack align="stretch" gap="16px">
              <For each={viewModel.questions}>
                {(_, index) => <QuestionView key={index} question={gameViewModel.questions[index]} />}
              </For>
              <StoryBannerView />
            </VStack>
          }
        >
          <>
            <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mut" mb="8px">
              案件
            </chakra.div>
            <chakra.h1
              fontFamily="serif"
              fontWeight="900"
              fontSize="26px"
              letterSpacing="2px"
              m="0 0 14px"
              pb="14px"
              borderBottom="3px double"
              borderColor="arch.rule"
              color="arch.ink"
            >
              {viewModel.title}
            </chakra.h1>
            <ArchiveMarkdown>{viewModel.puzzle}</ArchiveMarkdown>
          </>
        </Show>
      }
      bottom={
        <Flex align="center" gap="8px">
          <Tab active={viewModel.view === "puzzle"} onClick={() => (gameViewModel.view = "puzzle")}>
            案件
          </Tab>
          <Tab active={viewModel.view === "clues"} onClick={() => (gameViewModel.view = "clues")}>
            推理
          </Tab>
          <chakra.span flex="1" />
          <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="1px" color="arch.dim">
            已解 {solved} / {viewModel.questions.length}
          </chakra.span>
        </Flex>
      }
    />
  );
}
