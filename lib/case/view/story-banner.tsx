"use client";

import { useSnapshot } from "valtio";
import { gameViewModel } from "@lib/case/viewmodel";
import { StoryComplete } from "@lib/shared/components/archive/story-complete";

export function StoryBannerView() {
  const viewModel = useSnapshot(gameViewModel);
  if (!viewModel.story) return null;
  return (
    <StoryComplete
      story={viewModel.story}
      game="case"
      targetId={viewModel.id}
      onEnd={() => gameViewModel.endGame()}
    />
  );
}
