import { evaluate, start } from "@server/endpoints";
import { gameViewModel } from "../viewmodel/game";
import { clientSubmitClue } from "./clientEngine";

export async function submitClue(input: string): Promise<void> {
  if (gameViewModel.clientGame) {
    await clientSubmitClue(input);
  } else {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) { return; }
    await serverSubmitClue(input, sessionId);
  }
}

async function serverSubmitClue(input: string, sessionId: string): Promise<void> {
  const response = await evaluate(sessionId, input);
  console.log("Server response:", response);  
  if (!response) { return; }
  gameViewModel.clues = deepCopy(response.clues);
  gameViewModel.indicatedId = response.unlockedIds;
  gameViewModel.showInvalid = response.unlockedIds.length === 0;
}

export async function startGame(storyId: string): Promise<void> {
  const sessionId = localStorage.getItem("sessionId") || undefined;
  const response = await start({sessionId, storyId});
  if (!response) { return; }
  localStorage.setItem("sessionId", response.sessionId);
  gameViewModel.puzzle = response.puzzle;
  gameViewModel.clues = deepCopy(response.clues);
}

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
