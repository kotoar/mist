"use server";

import { MistStartResponse, MistSubmitRequest, MistSubmitResponse } from '@shared/mist-interface';
import { readStoryData } from './context';
import { evaluate } from './evaluate';
import { track } from '@vercel/analytics/server';

export async function start(storyId: string): Promise<MistStartResponse | null> {
  const storyData = await readStoryData(storyId);
  if (!storyData) { return null; }

  return {
    title: storyData.title,
    puzzle: storyData.puzzle,
    story: storyData.story,
    clues: storyData.clues.map(clue => ({
      id: clue.id,
      hint: clue.hint,
      trigger: clue.trigger,
      content: clue.content,
    })),
    sections: storyData.sections,
  };
}

export async function submit(request: MistSubmitRequest): Promise<MistSubmitResponse | null> {
  const { revealed, hint } = await evaluate({
    input: request.input,
    triggers: request.clues.map(clue => ({
      id: clue.id,
      trigger: clue.trigger,
    })),
    puzzle: request.puzzle,
    story: request.story,
  });

  if (!revealed) { return null; }

  if (revealed.length > 0) {
    track("mist_clue_revealed", { story: request.storyId });
  }

  return {
    revealed,
    hint,
  };
}
