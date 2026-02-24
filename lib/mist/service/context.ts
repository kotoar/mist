import { MistData, MistDataSchema } from "@lib/mist/schema";
import { readMistMistData } from "./data-reader";

export async function readStoryData(storyId: string): Promise<MistData | null> {
  const storyData = await readMistMistData(storyId);
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
