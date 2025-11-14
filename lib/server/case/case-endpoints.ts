"use server";

import { CaseStartResponse, CaseSubmitRequest, CaseSubmitResponse } from "@shared/case-interface";
import { CasePreview } from "@shared/case-schema";
import { redis } from "@server/services/redis";
import { startGame } from "./start";
import { readContext, saveContext } from "./case-data";
import { judge } from "./judge";

export async function list(): Promise<CasePreview[]> {
  return [
    { id: "case-02", title: "午夜的钟声", author: "天色盐", tags: ["本格"] },
  ];
}

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
    keys: question.keys || [],
    story: context.storyData.puzzle,
  });
  if (!response) { return null; }

  let completed = false;
  if (response.correct) {
    context.userData.solvedIds.push(request.questionId);
    await saveContext(request.sessionId, context);
    completed = context.userData.solvedIds.length === context.storyData.items.length;
  }

  console.log("solved ids:", context.userData.solvedIds);

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
