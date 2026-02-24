"use server";

import { CasePreview } from "@lib/case/schema";
import { MistPreview } from "@lib/mist/schema";
import { fetchMistCaseList } from "@lib/case/service/data-reader";
import { fetchMistMistList } from "@lib/mist/service/data-reader";

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
    ratingScore: item.rating_score || 0,
    ratingCount: item.rating_count || 0,
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
    cover: item.cover,
    ratingScore: item.rating_score || 0,
    ratingCount: item.rating_count || 0,
  }));
}
