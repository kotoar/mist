import { z } from "zod";

export const MistStartResponseSchema = z.object({
  title: z.string(),
  puzzle: z.string(),
  story: z.string().optional(),
  clues: z.array(z.object({
    id: z.string(),
    hint: z.string().optional(),
    trigger: z.string(),
    content: z.string(),
  })),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    clueIds: z.array(z.string()).default([])
  }))
});
export type MistStartResponse = z.infer<typeof MistStartResponseSchema>;

export interface MistSubmitRequest {
  storyId: string;
  input: string;
  solvedIds: string[];
  puzzle: string;
  story: string;
  clues: { id: string; trigger: string }[];
}
export interface MistSubmitResponse {
  revealed: string[];
  hint?: string;
}
