"use client";

import { start, submit } from "@lib/case/service/endpoints";
import { gameViewModel } from "@lib/case/viewmodel";
import { CaseStartResponse } from "@lib/case/schema";
import { track } from "@vercel/analytics";

interface CaseLocalState {
    storyId: string;
    solvedIds: string[];
}

const STORAGE_KEY_PREFIX = "case:";

function readLocalState(storyId: string): CaseLocalState {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${storyId}`);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.storyId === storyId && Array.isArray(parsed.solvedIds)) {
                return parsed;
            }
        }
    } catch { }
    return { storyId, solvedIds: [] };
}

function saveLocalState(storyId: string, state: CaseLocalState): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${storyId}`, JSON.stringify(state));
}

function clearLocalState(storyId: string): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${storyId}`);
}

export class ContextDelegate {
    static instance = new ContextDelegate();

    storyId?: string;
    storyData?: CaseStartResponse;
    localState: CaseLocalState = { storyId: "", solvedIds: [] };

    async load(storyId: string): Promise<void> {
        this.storyId = storyId;
        gameViewModel.status = "loading";

        let response;
        try {
            response = await start(storyId);
        } catch {
            gameViewModel.status = "error";
            return;
        }
        if (!response) { gameViewModel.status = "missing"; return; }

        this.storyData = response;
        this.localState = readLocalState(storyId);

        const completed = this.localState.solvedIds.length >= response.items.length;

        gameViewModel.load({
            id: storyId,
            title: response.title,
            puzzle: response.puzzle,
            story: completed ? response.story : undefined,
            items: response.items.map(item => ({
                id: item.id,
                question: item.question,
                answer: this.localState.solvedIds.includes(item.id) ? item.answer : undefined,
            })),
        });

        track("case_start", { story: storyId });
    }

    async submit(questionId: string, input: string): Promise<void> {
        if (!this.storyId || !this.storyData) { return; }

        const item = this.storyData.items.find(i => i.id === questionId);
        if (!item) { return; }

        if (this.localState.solvedIds.includes(questionId)) { return; }

        const response = await submit({
            storyId: this.storyId,
            questionId,
            input,
            trigger: item.trigger,
            puzzle: this.storyData.puzzle,
            story: this.storyData.story || "",
        });
        if (!response) { return; }

        const question = gameViewModel.questions.find(q => q.id === questionId);
        if (!question) { return; }

        if (response.correct) {
            this.localState.solvedIds = [...new Set([...this.localState.solvedIds, questionId])];
            saveLocalState(this.storyId, this.localState);

            question.answer = item.answer;
            question.wrongFlag = false;

            const completed = this.localState.solvedIds.length >= this.storyData.items.length;
            if (completed) {
                gameViewModel.story = this.storyData.story;
                track("case_solved", { story: this.storyId });
            }
        } else {
            question.wrongFlag = true;
            question.percentage = response.score;
        }
    }

    endGame(): void {
        if (!this.storyId) { return; }
        clearLocalState(this.storyId);
        this.storyId = undefined;
        this.storyData = undefined;
        this.localState = { storyId: "", solvedIds: [] };
    }
}
