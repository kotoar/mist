import { z } from "zod";

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

export const DetectStartResponseSchema = z.object({
  sessionId: z.string(),
  title: z.string(),
  puzzle: z.string(),
  story: z.string().optional(),
  logs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  currentIndex: z.string(),
  currentQuestion: z.string().optional(),
});
export type DetectStartResponse = z.infer<typeof DetectStartResponseSchema>;

export interface DetectSubmitResponse {
  score: number;
  hint?: string;
  answer?: string;
  story?: string;
}

export interface DetectNextResponse {
  question: string;
  index: string;
}
