"use server";

import { BundleResponse, ClueResponse } from "@shared/interfaces";
import { startGame } from "@server/handlers/session";
import { readContext, saveContext } from "./engine/context";
import { evaluateClue } from "./handlers/evaluate";

export async function list(): Promise<{ id: string, title: string }[]> {
  return [
    { id: "demo-01", title: "sz推理之夜-神父的愿望" },
  ];
}

export async function start({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<BundleResponse | null> {
  const response = await startGame({sessionId, storyId});
  return response;
}

export async function evaluate(sessionId: string, input: string): Promise<ClueResponse | null> {
  const context = await readContext(sessionId);
  if (!context) {
    return null;
  }
  const cluesRecord = Object.fromEntries(
    Object.entries(context.storyData.clues).filter(([id]) => !context.userData.discoveredClues.includes(id))
  );
  const response = await evaluateClue(input, cluesRecord);
  context.userData.discoveredClues.push(...response);
  await saveContext(sessionId, context);
  return {
    clues: Object.entries(context.storyData.clues).map(([id, content]) => 
      context.userData.discoveredClues.includes(id) ? content : undefined
    ),
    answer: Object.keys(context.storyData.clues).length === context.userData.discoveredClues.length ? context.storyData.answer : undefined,
  };
}
