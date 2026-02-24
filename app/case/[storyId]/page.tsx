"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientOnly, useBreakpointValue } from "@chakra-ui/react";
import { DesktopGameView } from "@lib/case/view/desktop";
import { MobileGameView } from "@lib/case/view/mobile";
import { ContextDelegate } from "@lib/case/model";

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
    ContextDelegate.instance.load(props.storyId);
  }, [props.storyId]);

  return isMobile ? <MobileGameView /> : <DesktopGameView />;
}
