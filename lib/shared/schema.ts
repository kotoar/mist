import { z } from "zod";

export const ClueSchema = z.object({
  id: z.string(),
  clue: z.string(),
  hint: z.string().optional(),
  trigger: z.string().optional(),
  keys: z.array(z.string()).optional(),
});

export const StoryDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  puzzle: z.string(),
  clues: z.array(ClueSchema),
  answer: z.string().optional(),
});

export type Clue = z.infer<typeof ClueSchema>;
export type StoryData = z.infer<typeof StoryDataSchema>;
