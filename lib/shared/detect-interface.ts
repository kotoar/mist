import { z } from "zod";

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
  answer?: string;
  story?: string;
}

export interface DetectNextResponse {
  question: string;
  index: string;
}
