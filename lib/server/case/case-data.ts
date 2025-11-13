import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { z } from "zod";
import { redis } from '@server/services/redis';
import { CaseData, CaseDataSchema } from '@shared/case-schema';

export interface CaseContext {
  storyData: CaseData;
  userData: CaseUserData;
}

export const CaseUserDataSchema = z.object({
  sessionId: z.string(),
  storyId: z.string(),
  solvedIds: z.array(z.string()).default([]),
});
export type CaseUserData = z.infer<typeof CaseUserDataSchema>;

export async function readContext(sessionId: string): Promise<CaseContext | null> {
  const userData = await readUserData(sessionId);
  if (!userData) {
    return null;
  }
  const storyData = readStoryData(userData.storyId);
  if (!storyData) {
    return null;
  }
  return {
    storyData,
    userData,
  };
}

export async function saveContext(sessionId: string, context: CaseContext): Promise<void> {
  await saveUserData(sessionId, context.userData.storyId, context.userData);
}

export function readStoryData(storyId: string): CaseData | null {
  const filePath = path.join(process.cwd(), 'public', 'story', `${storyId}.yaml`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const storyData = yaml.load(fileContents);
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

// redis, key: mist:{sessionId}
export async function readUserData(sessionId: string): Promise<CaseUserData | null> {
  const data = await redis.get(`case:${sessionId}`);
  if (data) {
    const parsed = JSON.parse(data);
    return CaseUserDataSchema.parse(parsed);
  }
  return null;
}

export async function saveUserData(sessionId: string, storyId: string, userData?: CaseUserData): Promise<void> {
  let data = "{}";
  if (userData) {
    data = JSON.stringify(userData);
  } else {
    data = JSON.stringify({ sessionId, storyId, discoveredClues: [] });
  }
  await redis.set(`case:${sessionId}`, data, 'EX', 60 * 60 * 24); // 1 days expiration
}
