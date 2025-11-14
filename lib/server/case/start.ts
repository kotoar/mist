import { CaseStartResponse } from '@/lib/shared/case-interface';
import { uuidv7 } from 'uuidv7';
import { CaseUserData, readStoryData, readUserData, saveUserData } from './case-data';
import { track } from '@vercel/analytics/server';

export async function startGame({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<CaseStartResponse | null> {
  let userData: CaseUserData | null = null;
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
  }
  
  const story = readStoryData(storyId);
  if (!story) { return null; }

  return {
    sessionId: sessionId,
    title: story.title,
    puzzle: story.puzzle,
    items: story.items.map(item => (
      {
        id: item.id,
        question: item.question,
        answer: userData?.solvedIds.includes(item.id) ? item.answer : undefined,
      }
    )),
    story: userData?.solvedIds.length === story.items.length ? story.story : undefined,
  }
}
