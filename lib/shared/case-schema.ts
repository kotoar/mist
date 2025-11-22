import { z } from "zod";

export const CasePreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]).readonly(),
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
