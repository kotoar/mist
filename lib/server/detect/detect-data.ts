import { z } from "zod";
import { redis } from '@server/services/redis';
import { CaseData, CaseDataSchema } from '@shared/case-schema';
import { readMistDetectData } from "./data-reader";

export interface DetectContext {
  storyData: CaseData;
  userData: DetectUserData;
}

export const DetectUserDataSchema = z.object({
  sessionId: z.string(),
  storyId: z.string(),
  currentIndex: z.number().default(0),
});
export type DetectUserData = z.infer<typeof DetectUserDataSchema>;

export async function readContext(sessionId: string): Promise<DetectContext | null> {
  const userData = await readUserData(sessionId);
  if (!userData) {
    return null;
  }
  const storyData = await readStoryData(userData.storyId);
  if (!storyData) {
    return null;
  }
  return {
    storyData,
    userData,
  };
}

export async function saveContext(sessionId: string, context: DetectContext): Promise<void> {
  await saveUserData(sessionId, context.userData.storyId, context.userData);
}

export async function readStoryData(storyId: string): Promise<CaseData | null> {
  const storyData = await readMistDetectData(storyId);
  if (!storyData) {
    return null;
  }
  const story = CaseDataSchema.safeParse(storyData);
  if (!story.success) {
    console.error("Failed to parse story data:", story.error);
    return null;
  }
  return story.data;
}

export async function readUserData(sessionId: string): Promise<DetectUserData | null> {
  const data = await redis.get(`detect:${sessionId}`);
  if (data) {
    const parsed = JSON.parse(data);
    return DetectUserDataSchema.parse(parsed);
  }
  return null;
}

export async function saveUserData(sessionId: string, storyId: string, userData?: DetectUserData): Promise<void> {
  const data: DetectUserData = userData || { sessionId, storyId, currentIndex: 0 };
  const dataStr = JSON.stringify(data);
  await redis.set(`detect:${sessionId}`, dataStr, 'EX', 60 * 60 * 24); // 1 days expiration
}
