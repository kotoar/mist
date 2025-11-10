"use client";

import { StoryData, StoryDataSchema } from "@shared/schema";
import { gameViewModel } from "@client/viewmodel/game";
import { evaluateClue } from "@server/handlers/evaluate";

export function clientLoadStoryData(story: string) {
  const data: StoryData = StoryDataSchema.parse(JSON.parse(story));
  clues = data.clues;
  discoveredClues = [];
  gameViewModel.puzzle = data.puzzle;
  gameViewModel.answer = data.answer;
  gameViewModel.clues = Object.entries(clues).map(([clueId, clueContent]) => 
    discoveredClues.includes(clueId) ? clueContent : undefined
  );
}

export async function clientSubmitClue(input: string): Promise<void> {
  const acceptedClueIds = await evaluateClue(input, clues);

  for (const clueId of acceptedClueIds) {
    if (!discoveredClues.includes(clueId)) {
      discoveredClues.push(clueId);
    }
  }

  gameViewModel.clues = Object.entries(clues).map(([clueId, clueContent]) => 
    discoveredClues.includes(clueId) ? clueContent : undefined
  );
}

let clues: Record<string, string> = {};
export let discoveredClues: string[] = [];