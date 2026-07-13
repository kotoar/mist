"use client";

import { For, VStack, chakra } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { mistViewModel } from "@lib/mist/viewmodel";
import { SectionView } from "./section";
import { MistStoryBannerView } from "./story-banner";
import { MistPanel } from "./panel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { GameScreen, PanelHeader, PanelScroll, PanelFooter, Emph } from "@lib/shared/components/archive/game-layout";
import { GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";
import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export function DesktopMistView() {
  const viewModel = useSnapshot(mistViewModel);
  const router = useRouter();
  const clues = viewModel.sections.flatMap((s) => s.clues);
  const solved = clues.filter((c) => c.content).length;

  if (viewModel.status !== "ready") {
    return <GameStateNotice status={viewModel.status} />;
  }

  return (
    <GameScreen
      label={`${viewModel.title} · 迷雾`}
      actions={
        <>
          <GameThemeToggle />
          <GameAction onClick={() => mistViewModel.skip()}>我想看答案</GameAction>
          <GameAction danger onClick={() => { mistViewModel.endGame(); router.push("/"); }}>
            结束游戏
          </GameAction>
        </>
      }
      left={
        <>
          <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mut">
            迷雾
          </chakra.div>
          <chakra.h1
            fontFamily="serif"
            fontWeight="900"
            fontSize="clamp(26px,3vw,36px)"
            letterSpacing="3px"
            m="12px 0 18px"
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
            title="迷雾"
            meta={
              <>
                已解 <Emph>{solved}</Emph> / {clues.length}
              </>
            }
          />
          <PanelScroll>
            <VStack align="stretch" gap="16px">
              <MistStoryBannerView />
              <For each={viewModel.sections}>{(section, index) => <SectionView key={index} section={section} />}</For>
            </VStack>
          </PanelScroll>
          <PanelFooter>
            <MistPanel />
          </PanelFooter>
        </>
      }
    />
  );
}
