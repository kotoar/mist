import { z } from "zod";

export const MistPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  tags: z.array(z.string()).default([]).readonly(),
});

const MistClueSchema = z.object({
  id: z.string(),
  hint: z.string().optional(),
  trigger: z.string().describe("判定输入是否正确的条件"),
  content: z.string().describe("输入正确后会显示给玩家的内容")
});

export const MistDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  puzzle: z.string(),
  clues: z.array(MistClueSchema),
  sections: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    clueIds: z.array(z.string()).default([])
  })),
  story: z.string().optional(),
});

export type MistPreview = z.infer<typeof MistPreviewSchema>;
export type MistClue = z.infer<typeof MistClueSchema>;
export type MistData = z.infer<typeof MistDataSchema>;