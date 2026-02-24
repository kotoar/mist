import { z } from "zod";

// --- Story data schemas (parsed from YAML content) ---

export const CasePreviewSchema = z.object({
    id: z.string(),
    game: z.enum(["case", "detect"]).default("case"),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    index: z.string(),
    title: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]).readonly(),
    cover: z.string().nullable(),
});

export const CaseItemSchema = z.object({
    id: z.string(),
    question: z.string(),
    trigger: z.string().describe("判定输入是否正确的条件"),
    answer: z.string().describe("输入正确后会显示给玩家的内容")
});

export const CaseDataSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    puzzle: z.string().describe("谜题内容"),
    items: z.array(CaseItemSchema),
    story: z.string().optional().describe("案件的真相"),
});

export type CasePreview = z.infer<typeof CasePreviewSchema>;
export type CaseItem = z.infer<typeof CaseItemSchema>;
export type CaseData = z.infer<typeof CaseDataSchema>;

// --- Case API interfaces ---

export const CaseJudgeSchema = z.object({
    correct: z.boolean()
        .describe("Whether the answer is correct"),
    score: z.number()
        .min(0)
        .max(100)
        .describe("Score for the answer, from 0 to 100"),
});
export type CaseJudge = z.infer<typeof CaseJudgeSchema>;

export const CaseStartResponseSchema = z.object({
    title: z.string(),
    puzzle: z.string(),
    story: z.string().optional(),
    items: z.array(z.object({
        id: z.string(),
        question: z.string(),
        trigger: z.string(),
        answer: z.string().optional(),
    }))
});
export type CaseStartResponse = z.infer<typeof CaseStartResponseSchema>;

export interface CaseSubmitRequest {
    storyId: string;
    questionId: string;
    input: string;
    trigger: string;
    puzzle: string;
    story: string;
}
export interface CaseSubmitResponse {
    questionId: string;
    correct: boolean;
    score: number;
    answer?: string;
}
