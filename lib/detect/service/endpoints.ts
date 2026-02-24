"use server";

import { DetectStartResponse, DetectSubmitRequest, DetectSubmitResponse } from "@lib/detect/schema";
import { readMistCaseData } from "@lib/case/service/data-reader";
import { judge } from "@lib/case/service/judge";

export async function start(storyId: string): Promise<DetectStartResponse | null> {
    const story = await readMistCaseData(storyId);
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

export async function submit(request: DetectSubmitRequest): Promise<DetectSubmitResponse | null> {
    const response = await judge({
        input: request.input,
        question: request.questionId,
        referenceAnswer: request.trigger,
        puzzle: request.puzzle,
        story: request.story,
        includeHint: true,
    });
    if (!response) { return null; }

    return {
        questionId: request.questionId,
        correct: response.correct,
        score: response.score,
        hint: response.hint,
    };
}
