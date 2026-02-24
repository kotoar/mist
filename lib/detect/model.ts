"use client";

import { start, submit } from "@lib/detect/service/endpoints";
import { detectViewModel } from "./viewmodel";
import { DetectStartResponse } from "@lib/detect/schema";
import { track } from "@vercel/analytics";

interface DetectLocalState {
    storyId: string;
    currentIndex: number;
    answeredIds: string[];
}

const STORAGE_KEY_PREFIX = "detect:";

function readLocalState(storyId: string): DetectLocalState {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${storyId}`);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.storyId === storyId) {
                return parsed;
            }
        }
    } catch { }
    return { storyId, currentIndex: 0, answeredIds: [] };
}

function saveLocalState(storyId: string, state: DetectLocalState): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${storyId}`, JSON.stringify(state));
}

function clearLocalState(storyId: string): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${storyId}`);
}

export class DetectDelegate {
    static instance = new DetectDelegate();

    storyId?: string;
    storyData?: DetectStartResponse;
    localState: DetectLocalState = { storyId: "", currentIndex: 0, answeredIds: [] };

    async load(storyId: string): Promise<void> {
        this.storyId = storyId;

        const response = await start(storyId);
        if (!response) { return; }

        this.storyData = response;
        this.localState = readLocalState(storyId);

        const currentItem = response.items[this.localState.currentIndex];
        const completed = this.localState.currentIndex >= response.items.length;

        // Build logs from answered questions
        const logs = response.items
            .filter((_item, idx) => idx < this.localState.currentIndex)
            .map(item => ({
                question: item.question,
                answer: item.answer,
            }));

        detectViewModel.load({
            id: storyId,
            title: response.title,
            puzzle: response.puzzle,
            story: completed ? response.story : undefined,
            logs,
            currentQuestion: completed ? undefined : currentItem?.question,
            currentIndex: `${this.localState.currentIndex + 1}/${response.items.length}`,
        });

        track("case_start", { story: storyId });
    }

    async submit(input: string): Promise<void> {
        if (!this.storyId || !this.storyData) { return; }

        const currentItem = this.storyData.items[this.localState.currentIndex];
        if (!currentItem) { return; }

        const response = await submit({
            storyId: this.storyId,
            questionId: currentItem.id,
            input,
            trigger: currentItem.trigger,
            puzzle: this.storyData.puzzle,
            story: this.storyData.story || "",
        });
        if (!response) { return; }

        if (response.correct) {
            this.handleCorrect(currentItem);
        } else {
            detectViewModel.hint = response.hint;
            detectViewModel.wrongFlag = true;
            detectViewModel.percentage = response.score;
        }
    }

    private handleCorrect(currentItem: any): void {
        detectViewModel.hint = undefined;
        detectViewModel.wrongFlag = false;
        detectViewModel.correctFlag = true;
        detectViewModel.standardAnswer = currentItem.answer;
    }

    skip(): void {
        const currentItem = this.storyData?.items[this.localState.currentIndex];
        if (currentItem) {
            this.handleCorrect(currentItem);
        }
    }

    nextQuestion(): void {
        if (!this.storyId || !this.storyData) { return; }
        const currentItem = this.storyData.items[this.localState.currentIndex];
        if (!currentItem) { return; }

        // Move to next question
        this.localState.currentIndex += 1;
        this.localState.answeredIds = [...new Set([...this.localState.answeredIds, currentItem.id])];
        saveLocalState(this.storyId, this.localState);

        // Add answered question to logs
        detectViewModel.logs = [...detectViewModel.logs, {
            question: currentItem.question,
            answer: currentItem.answer,
        }];

        const completed = this.localState.currentIndex >= this.storyData.items.length;
        if (completed) {
            detectViewModel.currentQuestion = undefined;
            detectViewModel.story = this.storyData.story;
            track("case_solved", { story: this.storyId });
        } else {
            const nextItem = this.storyData.items[this.localState.currentIndex];
            detectViewModel.currentQuestion = nextItem?.question;
            detectViewModel.currentIndex = `${this.localState.currentIndex + 1}/${this.storyData.items.length}`;
        }

        detectViewModel.correctFlag = false;
        detectViewModel.standardAnswer = undefined;
        detectViewModel.hint = undefined;
        detectViewModel.wrongFlag = false;
    }

    endGame(): void {
        if (!this.storyId) { return; }
        clearLocalState(this.storyId);
        this.storyId = undefined;
        this.storyData = undefined;
        this.localState = { storyId: "", currentIndex: 0, answeredIds: [] };
    }
}
