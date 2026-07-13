"use client";

import { Flex, For, VStack, chakra, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { mistViewModel } from "@lib/mist/viewmodel";
import { SectionView } from "./section";
import { MistStoryBannerView } from "./story-banner";
import { MistPanel } from "./panel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { MobileGameScreen, Tab } from "@lib/shared/components/archive/game-layout";
import { GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";
import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export function MobileMistGameView() {
  const viewModel = useSnapshot(mistViewModel);
  const router = useRouter();
  const clues = viewModel.sections.flatMap((s) => s.clues);
  const solved = clues.filter((c) => c.content).length;

  if (viewModel.status !== "ready") {
    return <GameStateNotice status={viewModel.status} />;
  }

  return (
    <MobileGameScreen
      label={`${viewModel.title} · 迷雾`}
      actions={
        <>
          <GameThemeToggle />
          <GameAction onClick={() => mistViewModel.skip()}>看答案</GameAction>
          <GameAction danger onClick={() => { mistViewModel.endGame(); router.push("/"); }}>
            结束
          </GameAction>
        </>
      }
      content={
        <Show
          when={viewModel.view === "puzzle"}
          fallback={
            <VStack align="stretch" gap="16px">
              <MistStoryBannerView />
              <For each={viewModel.sections}>{(section, index) => <SectionView key={index} section={section} />}</For>
            </VStack>
          }
        >
          <>
            <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mut" mb="8px">
              迷雾
            </chakra.div>
            <chakra.h1
              fontFamily="serif"
              fontWeight="900"
              fontSize="26px"
              letterSpacing="2px"
              m="0 0 16px"
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
        <VStack align="stretch" gap="10px">
          <Flex align="center" gap="8px">
            <Tab active={viewModel.view === "puzzle"} onClick={() => (mistViewModel.view = "puzzle")}>
              谜面
            </Tab>
            <Tab
              active={viewModel.view === "clues"}
              indicator={viewModel.indicated}
              onClick={() => {
                mistViewModel.view = "clues";
                mistViewModel.indicated = false;
              }}
            >
              线索
            </Tab>
            <chakra.span flex="1" />
            <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="1px" color="arch.dim">
              已解 {solved} / {clues.length}
            </chakra.span>
          </Flex>
          <MistPanel />
        </VStack>
      }
    />
  );
}
