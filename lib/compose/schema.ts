import { z } from "zod";

export const ComposePreviewSchema = z.object({
  id: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  index: z.string(),
  title: z.string(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]).readonly(),
  cover: z.string().nullable(),
});

const ComposeSentenceSchema = z.object({
  subject: z.string().describe("The subject of the sentence"),
  content: z.string().describe("The content of the sentence"),
  successCriteria: z.string().optional().describe("Criteria for successful composition related to this sentence"),
  failureCriteria: z.string().optional().describe("Criteria for failed composition related to this sentence"),
});

export const ComposeDataSchema = z.object({
  id: z.string(),
  title: z.string().describe("Title of the composed content"),
  setup: z.string().describe("Setup or introduction for the composed content"),
  sentences: z.array(ComposeSentenceSchema),
  ending: z.string().describe("Conclusion or ending for the composed content"),
  currentResult: z.string(),
  targetResult: z.string(),
});

export type ComposePreview = z.infer<typeof ComposePreviewSchema>;
export type ComposeSentence = z.infer<typeof ComposeSentenceSchema>;
export type ComposeData = z.infer<typeof ComposeDataSchema>;

// --- API interfaces ---


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
