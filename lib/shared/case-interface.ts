import { z } from "zod";

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
  sessionId: z.string(),
  title: z.string(),
  puzzle: z.string(),
  story: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    question: z.string(),
    answer: z.string().optional(),
  }))
});
export type CaseStartResponse = z.infer<typeof CaseStartResponseSchema>;

export interface CaseSubmitRequest {
  sessionId: string;
  questionId: string;
  input: string;
}
export interface CaseSubmitResponse {
  questionId: string;
  correct: boolean;
  score: number;
  answer?: string;
  story?: string;
}
