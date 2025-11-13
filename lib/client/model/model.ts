import { evaluate, start } from "@server/endpoints";
import { gameViewModel } from "../viewmodel/game";
import { clientSubmitClue } from "./clientEngine";
import { ContextDelegate } from "./context";

export async function startGame(storyId: string): Promise<void> {
  const sessionId = localStorage.getItem(`sessionId:${storyId}`) || undefined;
  const response = await start({sessionId, storyId});
  if (!response) { return; }
  localStorage.setItem(`sessionId:${storyId}`, response.sessionId);
  ContextDelegate.instance.storyId = storyId;
  gameViewModel.puzzle = response.puzzle;
  gameViewModel.sections = response.sections.map(section => ({
    title: section.title,
    completed: section.clues.every(clueId => response.clues.find(c => c.id === clueId)?.clue !== undefined),
    items: section.clues
      .map(clueId => response.clues.find(c => c.id === clueId))
      .filter((c): c is NonNullable<typeof c> => c !== undefined),
  }));
}

export async function submitClue(input: string): Promise<void> {
  if (gameViewModel.clientGame) {
    await clientSubmitClue(input);
  } else {
    const sessionId = localStorage.getItem(`sessionId:${ContextDelegate.instance.storyId}`);
    if (!sessionId) { return; }
    await serverSubmitClue(input, sessionId);
  }
}

async function serverSubmitClue(input: string, sessionId: string): Promise<void> {
  const response = await evaluate(sessionId, input);
  console.log("Server response:", response);  
  if (!response) { return; }
  gameViewModel.loadClues(response.clues);
  gameViewModel.indicatedId = response.unlockedIds;
  gameViewModel.showInvalid = response.unlockedIds.length === 0;
  gameViewModel.indicated = response.unlockedIds.length > 0 && gameViewModel.view === "puzzle";
}
