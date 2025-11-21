"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientOnly, useBreakpointValue } from "@chakra-ui/react";
import { DesktopGameView } from "@/lib/client/view/case/desktop";
import { MobileGameView } from "@/lib/client/view/case/mobile";
import { ContextDelegate } from "@/lib/client/model/case";

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
