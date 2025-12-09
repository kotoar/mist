"use server";

import { track } from "@vercel/analytics/server";
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
  let score = 0;
  let hint: string | undefined = undefined;
  if (!input) {
    correct = true;
    score = 100;
  } else {
    const result = await judgeB({
      input,
      question: question.question,
      referenceAnswer: question.trigger,
      puzzle: context.storyData.puzzle,
      story: context.storyData.story || "",
    });
    correct = result.correct;
    score = result.score;
    hint = result.hint;
  }
  if (correct) {
    const completed = context.userData.currentIndex + 1 >= context.storyData.items.length;
    if (completed) {
      track("case_solved", { story: context.userData.storyId });
    }
    return {
      score: score,
      hint: undefined,
      answer: question.answer,
      story: completed ? context.storyData.story : undefined,
    }
  } else {
    return {
      score: score,
      hint: hint,
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
