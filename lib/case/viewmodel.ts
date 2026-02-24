import { proxy } from "valtio";
import { ContextDelegate } from "@lib/case/model";

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

interface CaseLoadBundle {
    title: string;
    puzzle: string;
    story?: string;
    items: { id: string; question: string; answer?: string }[];
}

interface GameViewModel {
    view: "puzzle" | "clues";
    title: string;
    puzzle: string;
    questions: QuestionViewModel[];
    story?: string;

    load(bundle: CaseLoadBundle): void;
    endGame(): void;
}

export const gameViewModel = proxy<GameViewModel>({
    view: "puzzle",
    title: "",
    puzzle: "",
    questions: [],
    story: undefined,
    load(bundle: CaseLoadBundle) {
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
                    this.id,
                    this.input,
                ).then(() => this.interactable = true);
            }
        }));
        gameViewModel.story = bundle.story;
    },
    endGame() {
        ContextDelegate.instance.endGame();
    },
});
