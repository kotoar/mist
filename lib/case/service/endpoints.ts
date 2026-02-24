"use server";

import { CaseStartResponse, CaseSubmitRequest, CaseSubmitResponse } from "@lib/case/schema";
import { readStoryData } from "./data-reader";
import { judge } from "./judge";

export async function start(storyId: string): Promise<CaseStartResponse | null> {
    const story = await readStoryData(storyId);
    if (!story) { return null; }

    return {
        title: story.title,
        puzzle: story.puzzle,
        story: story.story,
        items: story.items.map(item => ({
            id: item.id,
            question: item.question,
            trigger: item.trigger,
            answer: item.answer,
        })),
    };
}

export async function submit(request: CaseSubmitRequest): Promise<CaseSubmitResponse | null> {
    const response = await judge({
        input: request.input,
        question: request.questionId,
        referenceAnswer: request.trigger,
        puzzle: request.puzzle,
        story: request.story,
    });
    if (!response) { return null; }

    return {
        questionId: request.questionId,
        correct: response.correct,
        score: response.score,
    };
}
