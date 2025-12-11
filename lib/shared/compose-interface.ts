import { z } from "zod";

export const ComposeJudgeSchema = z.object({
  valid: z.boolean()
    .describe("Whether the composition is logically valid"),
  invalidReason: z.string().optional()
    .describe("The reason why the composition is invalid, if applicable"),
  success: z.boolean()
    .describe("Whether the composition meets the target"),
  ending: z.string()
    .describe("The generated ending based on the user's composition"),
});

export type ComposeJudge = z.infer<typeof ComposeJudgeSchema>;

export interface ComposeSubmitRequest {
  storyId: string;
  index: number;
  input: string;
}

export interface ComposeSubmitResponse {
  valid: boolean;
  invalidReason?: string;
  success: boolean;
  ending: string; 
}
