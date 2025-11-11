import { proxy } from "valtio";
import { submitClue } from "../model/model";
import { endGame } from "@/lib/server/endpoints";
import { ClueRepresent } from "@/lib/shared/interfaces";
import { ContextDelegate } from "../model/context";

interface GameViewModel {
  puzzle?: string;
  clues: ClueRepresent[];
  answer?: string;
  input: string;
  clientGame: boolean;
  indicatedId: string[];
  showInvalid: boolean;

  reset(): void;
  submit(): void;
  endGame(): void;
}

export const gameViewModel = proxy<GameViewModel>({
  puzzle: "",
  clues: [],
  answer: undefined,
  input: "",
  clientGame: false,
  indicatedId: [],
  showInvalid: false,

  reset() {
    this.input = "";
    this.indicatedId = [];
    this.showInvalid = false;
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
