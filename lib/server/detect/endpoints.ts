"use server";

import { DetectNextResponse, DetectStartResponse, DetectSubmitResponse } from "@shared/detect-interface";
import { redis } from "@server/services/redis";
import { startDetect } from "./start";
import { readContext, saveContext } from "./detect-data";
import { judgeB } from "./judge";

export async function start({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<DetectStartResponse | null> {
  return await startDetect({ sessionId, storyId });
}

export async function submit(sessionId: string, input?: string): Promise<DetectSubmitResponse | null> {
  const context = await readContext(sessionId);
  if (!context) { return null; }
  const question = context.storyData.items[context.userData.currentIndex];
  if (!question) { return null; }

  let correct = false;
  if (!input) {
    correct = true;
  } else {
    correct = await judgeB({
      input,
      question: question.question,
      referenceAnswer: question.trigger,
      puzzle: context.storyData.puzzle,
      story: context.storyData.story || "",
    });
  }
  if (correct) {
    const completed = context.userData.currentIndex + 1 >= context.storyData.items.length;
    return {
      answer: question.answer,
      story: completed ? context.storyData.story : undefined,
    }
  } else {
    return {
      answer: undefined,
      story: undefined,
    }
  }
}

export async function next(sessionId: string): Promise<DetectNextResponse | null> {
  const context = await readContext(sessionId);
  if (!context) { return null; }
  context.userData.currentIndex += 1;
  await saveContext(sessionId, context);
  const question = context.storyData.items[context.userData.currentIndex]?.question;
  if (!question) { return null; }
  return  {
    question,
    index: `${context.userData.currentIndex + 1} / ${context.storyData.items.length}`,
  }
}

export async function end(sessionId: string): Promise<void> {
  await redis.del(`detect:${sessionId}`);
}
