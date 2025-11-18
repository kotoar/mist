import { z } from "zod";

export const MistStartResponseSchema = z.object({
  sessionId: z.string(),
  title: z.string(),
  puzzle: z.string(),
  story: z.string().optional(),
  clues: z.array(z.object({
    id: z.string(),
    hint: z.string().optional(),
    content: z.string().optional()
  })),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    clueIds: z.array(z.string()).default([])
  }))
});
export type MistStartResponse = z.infer<typeof MistStartResponseSchema>;

export interface MistSubmitRequest {
  sessionId: string;
  input: string;
}
export interface MistSubmitResponse {
  revealed: {
    id: string;
    content: string;
  }[];
  answer?: string;
}
