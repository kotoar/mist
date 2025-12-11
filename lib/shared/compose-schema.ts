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
