import { proxy } from "valtio";
import { DetectDelegate } from "./model";
import type { GameLoadStatus } from "@lib/shared/components/archive/game-state";

export interface DetectLoadBundle {
    id: string;
    title: string;
    puzzle: string;
    story?: string;
    logs: { question: string; answer: string }[];
    currentQuestion?: string;
    currentIndex: string;
}

export interface DetectViewModelType {
    id: string;
    status: GameLoadStatus;
    title: string;
    puzzle: string;
    story?: string;
    logs: { question: string; answer: string }[];
    currentQuestion?: string;
    currentIndex: string;
    input: string;
    interactable: boolean;
    hint?: string;
    wrongFlag: boolean;
    correctFlag: boolean;
    standardAnswer?: string;
    percentage: number;
    view: "puzzle" | "logs";

    load(bundle: DetectLoadBundle): void;
    submit(): void;
    skip(): void;
    nextQuestion(): void;
    endGame(): void;
}

export const detectViewModel = proxy<DetectViewModelType>({
    id: "",
    status: "loading",
    title: "",
    puzzle: "",
    story: undefined,
    logs: [],
    currentQuestion: undefined,
    currentIndex: "",
    input: "",
    interactable: true,
    hint: undefined,
    wrongFlag: false,
    correctFlag: false,
    standardAnswer: undefined,
    percentage: 0,
    view: "puzzle",

    load(bundle: DetectLoadBundle) {
        detectViewModel.id = bundle.id;
        detectViewModel.title = bundle.title;
        detectViewModel.puzzle = bundle.puzzle;
        detectViewModel.story = bundle.story;
        detectViewModel.logs = bundle.logs;
        detectViewModel.currentQuestion = bundle.currentQuestion;
        detectViewModel.currentIndex = bundle.currentIndex;
        detectViewModel.input = "";
        detectViewModel.interactable = true;
        detectViewModel.hint = undefined;
        detectViewModel.wrongFlag = false;
        detectViewModel.correctFlag = false;
        detectViewModel.standardAnswer = undefined;
        detectViewModel.percentage = 0;
        detectViewModel.view = "puzzle";
        detectViewModel.status = "ready";
    },

    submit() {
        const input = detectViewModel.input.trim();
        if (!input) { return; }
        detectViewModel.input = "";
        detectViewModel.interactable = false;
        detectViewModel.hint = undefined;
        DetectDelegate.instance.submit(input).then(() => {
            detectViewModel.interactable = true;
        });
    },

    skip() {
        detectViewModel.input = "";
        detectViewModel.hint = undefined;
        DetectDelegate.instance.skip();
    },

    nextQuestion() {
        DetectDelegate.instance.nextQuestion();
    },

    endGame() {
        DetectDelegate.instance.endGame();
    },
});
