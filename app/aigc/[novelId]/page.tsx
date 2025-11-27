"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ClientOnly } from "@chakra-ui/react";
import { NovelView } from "@client/view/aigc/novel";
import { novelViewModel } from "@client/view/aigc/viewmodel";
import { readNovelContent } from "@server/aigc/novel";

export default function NovelPage() {
  const params = useParams();
  const novelId = params.novelId as string;

  return (
    <ClientOnly>
      <NovelPageContent novelId={novelId} />
    </ClientOnly>
  );
}

function NovelPageContent(props: { novelId: string }) {
  useEffect(() => {
    readNovelContent(props.novelId).then(content => {
      novelViewModel.id = props.novelId;
      novelViewModel.content = content;
    });
  }, [props.novelId]);

  return (
    <NovelView />
  );
}
