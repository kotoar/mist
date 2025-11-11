import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { z } from "zod";
import { StoryData, StoryDataSchema } from "@shared/schema";
import { redis } from '@server/services/redis';

export const UserDataSchema = z.object({
  sessionId: z.string(),
  storyId: z.string(),
  discoveredClues: z.array(z.string()).default([]),
});
export type UserData = z.infer<typeof UserDataSchema>;

export interface Context {
  storyData: StoryData;
  userData: UserData;
}

export async function readContext(sessionId: string): Promise<Context | null> {
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

export async function saveContext(sessionId: string, context: Context): Promise<void> {
  await saveUserData(sessionId, context.userData.storyId, context.userData);
}

export function readStoryData(storyId: string): StoryData | null {
  const filePath = path.join(process.cwd(), 'public', 'story', `${storyId}.yaml`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const storyData = yaml.load(fileContents);
  if (!storyData) {
    return null;
  }
  const story = StoryDataSchema.safeParse(storyData);
  if (!story.success) {
    console.error("Failed to parse story data:", story.error);
    return null;
  }
  return story.data;
}

// redis, key: mist:{sessionId}
export async function readUserData(sessionId: string): Promise<UserData | null> {
  const data = await redis.get(`mist:${sessionId}`);
  if (data) {
    const parsed = JSON.parse(data);
    return UserDataSchema.parse(parsed);
  }
  return null;
}

export async function saveUserData(sessionId: string, storyId: string, userData?: UserData): Promise<void> {
  let data = "{}";
  if (userData) {
    data = JSON.stringify(userData);
  } else {
    data = JSON.stringify({ sessionId, storyId, discoveredClues: [] });
  }
  await redis.set(`mist:${sessionId}`, data, 'EX', 60 * 60 * 24); // 1 days expiration
}
