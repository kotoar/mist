"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientOnly, useBreakpointValue } from "@chakra-ui/react";
import { DesktopMistView } from "@client/view/mist/desktop";
import { MistDelegate } from "@client/model/mist";
import { MobileMistGameView } from "@/lib/client/view/mist/mobile";

export default function MistGamePage() {
  // get parameters from URL if needed
  const params = useParams();
  const storyId = params.storyId as string;

  return <ClientOnly>
    <MistGamePageContent storyId={storyId} />
  </ClientOnly>
}

function MistGamePageContent(props: { storyId: string }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    MistDelegate.instance.load(props.storyId);
  }, [props.storyId]);

  return isMobile ? <MobileMistGameView /> : <DesktopMistView />;
}
