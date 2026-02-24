import { z } from "zod";

// --- Detect API interfaces (shares CaseData schema via case/service/data-reader) ---

export const DetectJudgeSchema = z.object({
    correct: z.boolean()
        .describe("Whether the answer is correct"),
    score: z.number()
        .min(0)
        .max(100)
        .describe("Score for the answer, from 0 to 100"),
    hint: z.string().optional().describe("Optional hint for incorrect answers"),
});
export type DetectJudge = z.infer<typeof DetectJudgeSchema>;

export interface DetectStartResponse {
    title: string;
    puzzle: string;
    story?: string;
    items: {
        id: string;
        question: string;
        trigger: string;
        answer: string;
    }[];
}

export interface DetectSubmitRequest {
    storyId: string;
    questionId: string;
    input: string;
    trigger: string;
    puzzle: string;
    story: string;
}

export interface DetectSubmitResponse {
    questionId: string;
    correct: boolean;
    score: number;
    hint?: string;
    answer?: string;
}
