"use client";

import yaml from 'js-yaml';
import { Clue, StoryData, StoryDataSchema } from "@shared/schema";
import { gameViewModel } from "@client/viewmodel/game";
import { evaluateClue } from "@server/handlers/evaluate";

export function clientLoadStoryData(story: string) {
  const data: StoryData = StoryDataSchema.parse(yaml.load(story));
  clues = data.clues;
  discoveredClues = [];
  gameViewModel.puzzle = data.puzzle;
  gameViewModel.answer = data.answer;
  gameViewModel.clues = clues.map(clue => ({
    id: clue.id,
    hint: clue.hint,
    clue: discoveredClues.includes(clue.id) ? clue.clue : undefined,
  }));
}

export async function clientSubmitClue(input: string): Promise<void> {
  const acceptedClueIds = await evaluateClue(input, clues);
  for (const clueId of acceptedClueIds) {
    if (!discoveredClues.includes(clueId)) {
      discoveredClues.push(clueId);
    }
  }
  gameViewModel.clues = clues.map(clue => ({
    id: clue.id,
    hint: clue.hint,
    clue: discoveredClues.includes(clue.id) ? clue.clue : undefined,
  }));
  gameViewModel.indicatedId = acceptedClueIds;
  gameViewModel.showInvalid = acceptedClueIds.length === 0;
}

let clues: Clue[] = [];
export let discoveredClues: string[] = [];
