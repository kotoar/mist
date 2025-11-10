import { proxy } from "valtio";
import { submitClue } from "../model/model";

interface GameViewModel {
  puzzle?: string;
  clues: (string | undefined)[];
  answer?: string;
  input: string;
  clientGame: boolean;

  submit(): void;
}

export const gameViewModel = proxy<GameViewModel>({
  puzzle: "",
  clues: [],
  answer: undefined,
  input: "",
  clientGame: false,

  submit() {
    // Submission logic to be implemented
    submitClue(gameViewModel.input);
    gameViewModel.input = "";
  }
});
