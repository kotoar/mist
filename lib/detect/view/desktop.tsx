"use client";

import { Box, For, chakra } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { detectViewModel } from "@lib/detect/viewmodel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { GameScreen, PanelHeader, PanelScroll, PanelFooter, Emph } from "@lib/shared/components/archive/game-layout";
import { GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";
import { InterrogationPanel, LogCard, ResultCard } from "./panel";
import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export function DesktopDetectView() {
  const viewModel = useSnapshot(detectViewModel);
  const router = useRouter();

  if (viewModel.status !== "ready") {
    return <GameStateNotice status={viewModel.status} />;
  }

  return (
    <GameScreen
      label={`${viewModel.title} · 探案`}
      actions={
        <>
          <GameThemeToggle />
          <GameAction disabled={!viewModel.currentQuestion} onClick={() => detectViewModel.skip()}>
            跳过当前问题
          </GameAction>
          <GameAction danger onClick={() => { detectViewModel.endGame(); router.push("/"); }}>
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
            title="讯问记录"
            meta={
              <>
                已答 <Emph>{viewModel.logs.length}</Emph>
                {viewModel.currentIndex ? (
                  <>
                    {" "}· 当前第 <Emph>{viewModel.currentIndex}</Emph> 问
                  </>
                ) : null}
              </>
            }
          />
          <PanelScroll>
            <For each={viewModel.logs}>
              {(log, index) => <LogCard key={index} question={log.question} answer={log.answer} />}
            </For>
            <ResultCard />
            <Box h="4px" />
          </PanelScroll>
          <PanelFooter>
            <InterrogationPanel />
          </PanelFooter>
        </>
      }
    />
  );
}
