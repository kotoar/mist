import { proxy } from "valtio";
import { submitClue } from "@client/model/model";
import { endGame } from "@/lib/server/endpoints";
import { ClueRepresent } from "@/lib/shared/interfaces";
import { ContextDelegate } from "../model/context";
import { deepClone } from "valtio/utils";

export interface SectionContent {
  title?: string;
  completed: boolean;
  items: readonly ClueRepresent[];
}

interface GameViewModel {
  view: "puzzle" | "clues";
  puzzle?: string;
  sections: SectionContent[];
  answer?: string;
  input: string;
  clientGame: boolean;
  indicatedId: string[];
  indicated: boolean;
  showInvalid: boolean;

  reset(): void;
  loadClues(clues: ClueRepresent[]): void;
  submit(): void;
  endGame(): void;
}

export const gameViewModel = proxy<GameViewModel>({
  view: "puzzle",
  puzzle: "",
  sections: [],
  answer: undefined,
  input: "",
  clientGame: false,
  indicatedId: [],
  indicated: false,
  showInvalid: false,

  reset() {
    gameViewModel.view = "puzzle";
    gameViewModel.input = "";
    gameViewModel.indicatedId = [];
    gameViewModel.showInvalid = false;
  },
  loadClues(clues: ClueRepresent[]) {
    const sections = deepClone(gameViewModel.sections);
    for (const section of sections) {
      for (const clue of section.items) {
        const updatedClue = clues.find(c => c.id === clue.id);
        if (updatedClue) {
          clue.clue = updatedClue.clue;
        }
      }
      section.completed = section.items.every(clue => clue.clue !== undefined);
    }
    gameViewModel.sections = sections;
  },
  submit() {
    const input = gameViewModel.input.slice();
    gameViewModel.input = "";
    this.indicatedId = [];
    this.showInvalid = false;
    submitClue(input);
  },
  endGame() {
    const sessionId = localStorage.getItem(`sessionId:${ContextDelegate.instance.storyId}`);
    if (sessionId) { 
      endGame(sessionId); 
      localStorage.removeItem(`sessionId:${ContextDelegate.instance.storyId}`);
      ContextDelegate.instance.storyId = undefined;
    }
  },
});
