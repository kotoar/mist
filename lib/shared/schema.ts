import { z } from "zod";

export const StoryDataSchema = z.object({
  id: z.string().describe("Unique identifier for the story"),
  title: z.string().describe("Title of the story"),
  puzzle: z.string().describe("The main puzzle text"),
  clues: z.record(
    z.string().describe("Unique identifier for the clue"),
    z.string().describe("Content of the clue"),
  ).describe("List of clues associated with the story"),
  answer: z.string().optional().describe("The answer to the puzzle, if available"),
});

export type StoryData = z.infer<typeof StoryDataSchema>;
