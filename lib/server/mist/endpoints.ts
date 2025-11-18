"use server";

import { track } from '@vercel/analytics/server';
import { redis } from "@server/services/redis";
import { startGame } from "./start";
import { MistStartResponse, MistSubmitRequest, MistSubmitResponse } from '@shared/mist-interface';
import { MistPreview } from '@shared/mist-schema';
import { readContext, saveContext } from './context';
import { evaluate } from './evaluate';

export async function mistList(): Promise<MistPreview[]> {
  return [
    { id: "mist-01", title: "M01 神父的心愿", author: "sz推理之夜", tags: ["本格", "解谜"] },
  ];
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
    return { revealed: [], answer: "sf" };
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

export async function end(sessionId: string): Promise<void> {
  await redis.del(`case:${sessionId}`);
}
