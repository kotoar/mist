"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientOnly, useBreakpointValue } from "@chakra-ui/react";
import { listViewModel } from "@client/viewmodel/list";
import { GameView } from "@/lib/client/view/desktop/game";
import { MobileGameView } from "@/lib/client/view/mobile/game";

export default function GamePage() {
  // get parameters from URL if needed
  const params = useParams();
  const storyId = params.storyId as string;

  return <ClientOnly>
    <GamePageContent storyId={storyId} />
  </ClientOnly>
}

function GamePageContent(props: { storyId: string }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    listViewModel.goto(props.storyId);
  }, [props.storyId]);

  return isMobile ? <MobileGameView /> : <GameView />;
}
