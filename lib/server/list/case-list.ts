"use server";

import { CasePreview } from "@shared/case-schema";
import { MistPreview } from "@shared/mist-schema";
import { fetchMistCaseList } from "@server/case/data-reader";
import { fetchMistMistList } from "@server/mist/data-reader";

export async function caseList(): Promise<CasePreview[]> {
  const items = await fetchMistCaseList();
  function parseDifficulty(diff: string | null): "easy" | "medium" | "hard" | undefined {
    switch (diff) {
      case "easy":
      case "medium":
      case "hard":
        return diff;
      default:
        return undefined;
    }
  }
  return items.map(item => ({
    id: item.case_id,
    index: item.index,
    game: item.game,
    difficulty: parseDifficulty(item.difficulty),
    title: item.title,
    author: item.author || undefined,
    tags: item.tags || [],
    cover: item.cover,
  }));
}

export async function mistList(): Promise<MistPreview[]> {
  const items = await fetchMistMistList();
  return items.map(item => ({
    id: item.mist_id,
    index: item.index,
    title: item.title,
    author: item.author || undefined,
    tags: item.tags || [],
  }));
}
