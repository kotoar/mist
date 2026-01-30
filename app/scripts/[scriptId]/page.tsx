"use client";

import { ScriptView } from "@/lib/client/view/scripts/script";
import { ClientOnly } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { scriptViewModel } from "@/lib/client/viewmodel/scripts";

export default function ScriptPage() {
  // get parameters from URL if needed
  const params = useParams();
  const scriptId = params.scriptId as string;

  return <ClientOnly>
    <ScriptPageContent scriptId={scriptId} />
  </ClientOnly>
}

function ScriptPageContent(props: { scriptId: string }) {
  useEffect(() => {
    const fetchScript = async () => {
      await fetch(`/scripts/${props.scriptId}.md`)
        .then(response => response.text())
        .then(text => scriptViewModel.script = text);
    }
    fetchScript();
  }, [props.scriptId]);

  return <ScriptView />;
}
