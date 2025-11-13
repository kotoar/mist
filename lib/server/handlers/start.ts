import { uuidv7 } from 'uuidv7';
import { BundleResponse } from "@shared/interfaces";
import { readStoryData, readUserData, saveUserData, UserData } from '@server/engine/context';

export async function startGame({sessionId, storyId}: {sessionId?: string, storyId: string}): Promise<BundleResponse | null> {
  let userData: UserData | null = null;
  if (sessionId) {
    console.log("[session] load game session:", sessionId);
    userData = await readUserData(sessionId);
  }
  if (!sessionId || !userData || !userData.sessionId) {
    sessionId = uuidv7();
    console.log("[session] create new game session:", sessionId);
    saveUserData(sessionId, storyId);
  }
  
  const story = readStoryData(storyId);
  if (!story) { return null; }

  const clues = story.clues.map(clue => ({
    id: clue.id,
    hint: clue.hint,
    clue: userData && userData.discoveredClues.includes(clue.id) ? clue.clue : undefined,
  }));

  return {
    sessionId: sessionId,
    puzzle: story.puzzle,
    sections: story.sections,
    clues: clues
  }
}
