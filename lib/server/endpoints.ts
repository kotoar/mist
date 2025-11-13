"use server";

import { BundleResponse, ClueResponse, StoryItem } from "@shared/interfaces";
import { startGame } from "@/lib/server/handlers/start";
import { readContext, saveContext } from "./engine/context";
import { evaluateClue } from "./handlers/evaluate";
import { redis } from "./services/redis";

export async function list(): Promise<StoryItem[]> {
  return [
    { id: "demo-01", title: "sz推理之夜-神父的愿望", author: "sz推理之夜", tags: ["本格", "转载"] },
    { id: "demo-02", title: "心理医生的沉默", author: "DeepClue", tags: ["本格", "AI生成"] },
    { id: "demo-03", title: "庄园里的最后一盏蜡", author: "DeepClue", tags: ["本格", "AI生成"] },
    { id: "demo-04", title: "旧书店的第三声钟", author: "DeepClue", tags: ["变格", "AI生成", "克苏鲁"] },
    { id: "demo-05", title: "学院钟楼下的影子", author: "DeepClue", tags: ["变格", "AI生成", "魔法"] },
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
  const cluesRecords = context.storyData.clues.filter(clue => 
    !context.userData.discoveredClues.includes(clue.id)
  );
  const response = await evaluateClue(input, cluesRecords, context.storyData.answer);
  context.userData.discoveredClues.push(...response);
  await saveContext(sessionId, context);

  const completed = context.storyData.clues.length === context.userData.discoveredClues.length;

  return {
    clues: context.storyData.clues.map(clue => ({
      id: clue.id,
      hint: clue.hint,
      clue: context.userData.discoveredClues.includes(clue.id) ? clue.clue : undefined,
    })),
    unlockedIds: response,
    answer: completed ? context.storyData.answer : undefined,
  };
}

export async function endGame(sessionId: string): Promise<void> {
  await redis.del(`mist:${sessionId}`);
}
