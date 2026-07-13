"use client";

import { useSnapshot } from "valtio";
import { mistViewModel } from "@lib/mist/viewmodel";
import { StoryComplete } from "@lib/shared/components/archive/story-complete";

export function MistStoryBannerView() {
  const viewModel = useSnapshot(mistViewModel);
  if (!viewModel.story) return null;
  return (
    <StoryComplete
      story={viewModel.story}
      game="mist"
      targetId={viewModel.id}
      onEnd={() => mistViewModel.endGame()}
    />
  );
}
