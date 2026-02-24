"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ClientOnly } from "@chakra-ui/react";
import { NovelView } from "@lib/novel/view/novel";
import { novelViewModel } from "@lib/novel/viewmodel";
import { readNovelContent } from "@lib/novel/service/novel";

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
