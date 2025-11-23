import { uuidv7 } from 'uuidv7';
import { track } from '@vercel/analytics/server';
import { DetectUserData, readStoryData, readUserData, saveUserData } from './detect-data';
import { DetectStartResponse } from '@/lib/shared/detect-interface';

export async function startDetect({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<DetectStartResponse | null> {
  let userData: DetectUserData | null = null;
  if (sessionId) {
    console.log("[session] restore game session:", sessionId);
    track("case_restore", { story: storyId });
    userData = await readUserData(sessionId);
  }
  if (!sessionId || !userData || !userData.sessionId) {
    sessionId = uuidv7();
    console.log("[session] create new game session:", sessionId);
    track("case_start", { story: storyId });
    saveUserData(sessionId, storyId);
    userData = { sessionId, storyId, currentIndex: 0 };
  }
  
  const story = await readStoryData(storyId);
  if (!story) { return null; }

  return {
    sessionId: sessionId,
    title: story.title,
    puzzle: story.puzzle,
    currentIndex: `${userData.currentIndex} / ${story.items.length}`,
    currentQuestion: story.items[userData.currentIndex]?.question,
    logs: story.items
      .filter((_, index) => index < userData.currentIndex)
      .map(item => ({
        question: item.question,
        answer: item.answer,
      })
    ),
    story: userData.currentIndex >= story.items.length ? story.story : undefined,
  }
}
