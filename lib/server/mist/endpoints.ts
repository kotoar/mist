"use server";

import { track } from '@vercel/analytics/server';
import { redis } from "@server/services/redis";
import { startGame } from "./start";
import { MistStartResponse, MistSubmitRequest, MistSubmitResponse } from '@shared/mist-interface';
import { MistPreview } from '@shared/mist-schema';
import { readContext, saveContext } from './context';
import { evaluate } from './evaluate';
import { fetchMistMistList } from './data-reader';

export async function mistList(): Promise<MistPreview[]> {
  const items = await fetchMistMistList();
  return items.map(item => ({
    id: item.mist_id,
    title: item.title,
    author: item.author || undefined,
    tags: item.tags || [],
  }));
}

export async function start({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<MistStartResponse | null> {
  return await startGame({ sessionId, storyId });
}

export async function submit(request: MistSubmitRequest): Promise<MistSubmitResponse | null> {
  const context = await readContext(request.sessionId);
  if (!context) { return null; }

  const revealed = await evaluate({
    input: request.input,
    context: context,
  });
  if (!revealed) { return null; }

  if (revealed.length === 0) {
    return { revealed: [] };
  }

  context.userData.solvedIds = [...new Set([...context.userData.solvedIds, ...revealed])];
  const completed = context.userData.solvedIds.length === context.storyData.clues.length;
  if (completed) {
    track("mist_solved", { story: context.userData.storyId });
  }

  await saveContext(request.sessionId, context);

  return {
    revealed: revealed.map(id => (
      {
        id,
        content: context.storyData.clues.find(clue => clue.id === id)?.content || ""
      }
    )),
    answer: completed ? context.storyData.story : undefined,
  }
}

export async function skip(sessionId: string): Promise<MistSubmitResponse | null> {
  const context = await readContext(sessionId);
  if (!context) { return null; }

  context.userData.solvedIds = context.storyData.clues.map(clue => clue.id);
  await saveContext(sessionId, context);

  track("mist_skipped", { story: context.userData.storyId });

  return {
    revealed: context.storyData.clues.map(clue => ({
      id: clue.id,
      content: clue.content || ""
    })),
    answer: context.storyData.story,
  };
}

export async function end(sessionId: string): Promise<void> {
  await redis.del(`case:${sessionId}`);
}
