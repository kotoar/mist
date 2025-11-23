"use server";

import { track } from '@vercel/analytics/server';
import { CaseStartResponse, CaseSubmitRequest, CaseSubmitResponse } from "@shared/case-interface";
import { redis } from "@server/services/redis";
import { startGame } from "./start";
import { readContext, saveContext } from "./case-data";
import { judge } from "./judge";

export async function start({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<CaseStartResponse | null> {
  return await startGame({ sessionId, storyId });
}

export async function submit(request: CaseSubmitRequest): Promise<CaseSubmitResponse | null> {
  const context = await readContext(request.sessionId);
  const question = context?.storyData.items.find(item => item.id === request.questionId);
  if (!context || !question) {
    return null;
  }
  const response = await judge({
    input: request.input,
    question: question.question,
    referenceAnswer: question.trigger,
    puzzle: context.storyData.puzzle,
    story: context.storyData.story || "",
  });
  if (!response) { return null; }

  let completed = false;
  if (response.correct) {
    context.userData.solvedIds.push(request.questionId);
    await saveContext(request.sessionId, context);
    completed = context.userData.solvedIds.length === context.storyData.items.length;
    if (completed) {
      track("case_solved", { story: context.userData.storyId });
    }
  }

  return {
    questionId: request.questionId,
    correct: response.correct,
    score: response.score,
    answer: response.correct ? question.answer : undefined,
    story: completed ? context.storyData.story : undefined,
  }
}

export async function end(sessionId: string): Promise<void> {
  await redis.del(`case:${sessionId}`);
}
