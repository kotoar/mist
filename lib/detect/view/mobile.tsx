"use client";

import { Flex, For, VStack, chakra, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { detectViewModel } from "@lib/detect/viewmodel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { MobileGameScreen, Tab } from "@lib/shared/components/archive/game-layout";
import { GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";
import { InterrogationPanel, LogCard, ResultCard } from "./panel";
import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export function MobileDetectView() {
  const viewModel = useSnapshot(detectViewModel);
  const router = useRouter();

  if (viewModel.status !== "ready") {
    return <GameStateNotice status={viewModel.status} />;
  }

  return (
    <MobileGameScreen
      label={`${viewModel.title} · 探案`}
      actions={
        <>
          <GameThemeToggle />
          <GameAction danger onClick={() => { detectViewModel.endGame(); router.push("/"); }}>
            结束
          </GameAction>
        </>
      }
      content={
        <Show
          when={viewModel.view === "puzzle"}
          fallback={
            <VStack align="stretch" gap="0">
              <For each={viewModel.logs}>
                {(log, index) => <LogCard key={index} question={log.question} answer={log.answer} />}
              </For>
              <ResultCard />
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
        <VStack align="stretch" gap="10px">
          <Flex gap="8px">
            <Tab active={viewModel.view === "puzzle"} onClick={() => (detectViewModel.view = "puzzle")}>
              案情
            </Tab>
            <Tab active={viewModel.view === "logs"} onClick={() => (detectViewModel.view = "logs")}>
              讯问记录
            </Tab>
          </Flex>
          <InterrogationPanel />
        </VStack>
      }
    />
  );
}
