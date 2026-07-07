"use client";

import { For, VStack, chakra } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { gameViewModel } from "@lib/case/viewmodel";
import { QuestionView } from "./question";
import { StoryBannerView } from "./story-banner";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { GameScreen, PanelHeader, PanelScroll, Emph } from "@lib/shared/components/archive/game-layout";
import { GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";
import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export function DesktopGameView() {
  const viewModel = useSnapshot(gameViewModel);
  const router = useRouter();
  const solved = viewModel.questions.filter((q) => !!q.answer).length;

  if (viewModel.status !== "ready") {
    return <GameStateNotice status={viewModel.status} />;
  }

  return (
    <GameScreen
      label={`${viewModel.title} · 演绎`}
      actions={
        <>
          <GameThemeToggle />
          <GameAction danger onClick={() => { gameViewModel.endGame(); router.push("/"); }}>
            结束游戏
          </GameAction>
        </>
      }
      left={
        <>
          <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mut">
            案件
          </chakra.div>
          <chakra.h1
            fontFamily="serif"
            fontWeight="900"
            fontSize="clamp(26px,3vw,36px)"
            letterSpacing="3px"
            m="12px 0 16px"
            pb="16px"
            borderBottom="3px double"
            borderColor="arch.rule"
            color="arch.ink"
          >
            {viewModel.title}
          </chakra.h1>
          <ArchiveMarkdown>{viewModel.puzzle}</ArchiveMarkdown>
        </>
      }
      right={
        <>
          <PanelHeader
            title="推理"
            meta={
              <>
                已解 <Emph>{solved}</Emph> / {viewModel.questions.length}
              </>
            }
          />
          <PanelScroll>
            <VStack align="stretch" gap="16px">
              <For each={viewModel.questions}>
                {(_, index) => <QuestionView key={index} question={gameViewModel.questions[index]} />}
              </For>
              <StoryBannerView />
            </VStack>
          </PanelScroll>
        </>
      }
    />
  );
}
