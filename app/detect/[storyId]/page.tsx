"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientOnly, useBreakpointValue } from "@chakra-ui/react";
import { DetectDelegate } from "@client/model/detect";
import { DesktopDetectView } from "@client/view/detect/desktop";
import { MobileDetectView } from "@/lib/client/view/detect/mobile";

export default function DetectPage() {
  // get parameters from URL if needed
  const params = useParams();
  const storyId = params.storyId as string;

  return <ClientOnly>
    <DetectPageContent storyId={storyId} />
  </ClientOnly>
}

function DetectPageContent(props: { storyId: string }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    DetectDelegate.instance.load(props.storyId);
  }, [props.storyId]);

  return isMobile ? <MobileDetectView /> : <DesktopDetectView />;
}
