"use server";

import { CasePreview } from "@shared/case-schema";
import { fetchMistCaseList } from "@server/case/data-reader";

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
    game: item.game,
    difficulty: parseDifficulty(item.difficulty),
    title: item.title,
    author: item.author || undefined,
    tags: item.tags || [],
  }));
}
