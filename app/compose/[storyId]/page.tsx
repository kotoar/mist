"use client";

import { useParams } from "next/navigation";
import { ClientOnly } from "@chakra-ui/react";
import { DesktopComposeView } from "@client/view/compose/desktop";
import { ComposeDelegate } from "@client/model/compose";
import { useEffect } from "react";

export default function ComposePage() {
  // get parameters from URL if needed
  const params = useParams();
  const storyId = params.storyId as string;

  return <ClientOnly>
    <ComposePageContent storyId={storyId} />
  </ClientOnly>
}

function ComposePageContent(props: { storyId: string }) {
  // const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    ComposeDelegate.instance.load(props.storyId);
  }, [props.storyId]);

  return <DesktopComposeView />;
}
