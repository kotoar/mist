"use client";

import { listViewModel } from "@client/viewmodel/list";
import { GameView } from "@client/view/game";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientOnly } from "@chakra-ui/react";

export default function GamePage() {
  // get parameters from URL if needed
  const params = useParams();
  const storyId = params.storyId as string;

  return <ClientOnly>
    <GamePageContent storyId={storyId} />
  </ClientOnly>
}

function GamePageContent(props: { storyId: string }) {
  useEffect(() => {
    listViewModel.goto(props.storyId);
  }, [props.storyId]);

  return <GameView />;
}
