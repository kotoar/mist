import { z } from "zod";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import { MistData, MistDataSchema } from "@shared/mist-schema";
import { redis } from "@server/services/redis";

export interface MistContext {
  storyData: MistData;
  userData: MistUserData;
}

export const MistUserDataSchema = z.object({
  sessionId: z.string(),
  storyId: z.string(),
  solvedIds: z.array(z.string()).default([]),
});
export type MistUserData = z.infer<typeof MistUserDataSchema>;


export async function readContext(sessionId: string): Promise<MistContext | null> {
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

export async function saveContext(sessionId: string, context: MistContext): Promise<void> {
  await saveUserData(sessionId, context.userData.storyId, context.userData);
}

export async function readStoryData(storyId: string): Promise<MistData | null> {
  const storyData = await readMistData(storyId);
  if (!storyData) {
    return null;
  }
  const story = MistDataSchema.safeParse(storyData);
  if (!story.success) {
    console.error("Failed to parse story data:", story.error);
    return null;
  }
  return story.data;
}

async function readMistData(mistId: string): Promise<MistData | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "story", `${mistId}.yaml`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = yaml.parse(fileContent);
    return data;
  } catch (error) {
    console.error(`Failed to read mist data for ${mistId}:`, error);
    return null;
  }
}

// redis, key: mist:{sessionId}
export async function readUserData(sessionId: string): Promise<MistUserData | null> {
  const data = await redis.get(`mist:${sessionId}`);
  if (data) {
    const parsed = JSON.parse(data);
    return MistUserDataSchema.parse(parsed);
  }
  return null;
}

export async function saveUserData(sessionId: string, storyId: string, userData?: MistUserData): Promise<void> {
  let data = "{}";
  if (userData) {
    data = JSON.stringify(userData);
  } else {
    data = JSON.stringify({ sessionId, storyId, discoveredClues: [] });
  }
  await redis.set(`mist:${sessionId}`, data, 'EX', 60 * 60 * 24); // 1 days expiration
}


