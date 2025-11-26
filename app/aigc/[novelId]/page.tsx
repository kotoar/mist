"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { NovelView } from "@client/view/aigc/novel";
import { novelViewModel } from "@client/view/aigc/viewmodel";
import { readNovelContent } from "@server/aigc/novel";

export default function NovelPage() {
  const params = useParams();
  const novelId = params.novelId as string;

  useEffect(() => {
    readNovelContent(novelId).then(content => {
      novelViewModel.content = content;
    });
  }, [novelId]);

  return (
    <NovelView />
  );
}