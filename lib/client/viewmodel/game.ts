import { proxy } from "valtio";
import { CaseStartResponse } from "@shared/case-interface";
import { ContextDelegate } from "@client/model/context";

export interface QuestionViewModel {
  id: string;
  input: string;
  question: string;
  answer?: string;
  wrongFlag: boolean;
  percentage: number;
  interactable: boolean;
  updateInput(input: string): void;
  submit(): void;
}

interface GameViewModel {
  view: "puzzle" | "clues";
  title: string;
  puzzle: string;
  questions: QuestionViewModel[];
  story?: string;

  load(bundle: CaseStartResponse): void;
  endGame(): void;
}

export const gameViewModel = proxy<GameViewModel>({
  view: "puzzle",
  title: "",
  puzzle: "",
  questions: [],
  story: undefined,
  load(bundle: CaseStartResponse) {
    gameViewModel.title = bundle.title;
    gameViewModel.puzzle = bundle.puzzle;
    gameViewModel.questions = bundle.items.map(item => proxy<QuestionViewModel>({
      id: item.id,
      input: "",
      question: item.question,
      answer: item.answer,
      wrongFlag: false,
      percentage: 0,
      interactable: true,
      updateInput(input: string) {
        this.input = input;
      },
      submit() {
        if (!this.interactable) { return; }
        this.interactable = false;
        ContextDelegate.instance.submit(
          ContextDelegate.instance.sessionId!,
          this.id,
          this.input,
        ).then(() => this.interactable = true);
      }
    }));
  },
  endGame() {
    ContextDelegate.instance.endGame();
  },
});
