"use client";

import { useSnapshot } from "valtio";
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { track } from "@vercel/analytics";
import { novelViewModel } from "../viewmodel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { GameAction } from "@lib/shared/components/archive/game-topbar";

export function NovelView() {
  const viewModel = useSnapshot(novelViewModel);
  const [likeSelected, setLikeSelected] = useState<"like" | "dislike" | undefined>(undefined);

  function handleLike() {
    if (likeSelected !== undefined) return;
    setLikeSelected("like");
    track("novel_like", { novelId: novelViewModel.id });
  }

  function handleDislike() {
    if (likeSelected !== undefined) return;
    setLikeSelected("dislike");
    track("novel_dislike", { novelId: novelViewModel.id });
  }

  return (
    <Box maxW="760px" mx="auto" px={{ base: "20px", md: "32px" }} py="30px" minH="100vh">
      <ArchiveMarkdown>{viewModel.content}</ArchiveMarkdown>
      <Flex justify="flex-end" gap="14px" mt="24px" pt="18px" borderTop="1px solid" borderColor="arch.rule">
        <Show when={likeSelected === undefined || likeSelected === "like"}>
          <GameAction onClick={handleLike}>
            {likeSelected === "like" ? "✓ 这篇还可以" : "这篇还可以"}
          </GameAction>
        </Show>
        <Show when={likeSelected === undefined || likeSelected === "dislike"}>
          <GameAction danger onClick={handleDislike}>
            {likeSelected === "dislike" ? "✓ 这篇不行" : "这篇不行"}
          </GameAction>
        </Show>
      </Flex>
    </Box>
  );
}

function Show({ when, children }: { when: boolean; children: React.ReactNode }) {
  return when ? <>{children}</> : null;
}
