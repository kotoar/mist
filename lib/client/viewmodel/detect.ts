import { proxy } from "valtio";
import { DetectStartResponse } from "@/lib/shared/detect-interface";
import { DetectDelegate } from "../model/detect";

interface DetectViewModel {
  view: "puzzle" | "logs";
  title: string;
  puzzle: string;
  logs: readonly {
    question: string;
    answer: string;
  }[];
  currentIndex?: string;
  currentQuestion?: string;
  currentAnswer?: string;
  currentFinished?: boolean;
  input: string;
  story?: string;
  score: number;
  hint: string;

  interactable: boolean;

  load(bundle: DetectStartResponse): void;
  submit(): Promise<void>;
  endGame(): void;
}

export const detectViewModel = proxy<DetectViewModel>({
  view: "puzzle",
  title: "",
  puzzle: "",
  logs: [],
  currentIndex: undefined,
  currentQuestion: undefined,
  currentAnswer: undefined,
  currentFinished: undefined,
  input: "",
  story: undefined,
  interactable: true,
  score: 100,
  hint: "",
  
  load(bundle: DetectStartResponse) {
    detectViewModel.title = bundle.title;
    detectViewModel.puzzle = bundle.puzzle;
    detectViewModel.logs = bundle.logs;
    detectViewModel.currentIndex = bundle.currentIndex;
    detectViewModel.currentQuestion = bundle.currentQuestion;
    detectViewModel.currentAnswer = undefined;
    detectViewModel.currentFinished = undefined;
    detectViewModel.input = "";
    detectViewModel.story = bundle.story;
    detectViewModel.interactable = true;
  },
  async submit() {
    const input = detectViewModel.input.slice();
    detectViewModel.interactable = false;
    await DetectDelegate.instance.submit(input);
    detectViewModel.input = "";
    detectViewModel.interactable = true;
  },
  endGame() {
    DetectDelegate.instance.endGame();
  },
});
