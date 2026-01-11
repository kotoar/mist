import { uuidv7 } from 'uuidv7';
import { track } from '@vercel/analytics/server';
import { MistStartResponse } from '@shared/mist-interface';
import { MistUserData, readStoryData, readUserData, saveUserData } from '@server/mist/context';

export async function startGame({ sessionId, storyId }: { sessionId?: string, storyId: string }): Promise<MistStartResponse | null> {
  let userData: MistUserData | null = null;
  if (sessionId) {
    console.log("[session] restore game session:", sessionId);
    track("mist_restore", { story: storyId });
    userData = await readUserData(sessionId);
  }
  if (!sessionId || !userData || !userData.sessionId) {
    sessionId = uuidv7();
    console.log("[session] create new game session:", sessionId);
    track("mist_start", { story: storyId });
    await saveUserData(sessionId, storyId);
  }

  const storyData = await readStoryData(storyId);
  if (!storyData) { return null; }

  const completed = userData ? userData.solvedIds.length >= storyData.clues.length : false;

  return {
    sessionId: sessionId,
    title: storyData.title,
    puzzle: storyData.puzzle,
    story: completed ? storyData.story : undefined,
    clues: storyData.clues.map(clue =>
      userData?.solvedIds.includes(clue.id) ? { id: clue.id, content: `【${clue.trigger}】\n ${clue.content}` } : { id: clue.id, hint: clue.hint }
    ),
    sections: storyData.sections
  }
}
