"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const ClueEvaluateSchema = z.object({
  clueIds: z.array(z.string())
    .default([])
    .describe("List of clue IDs that were accepted"),
});

export async function evaluateClue(
  input: string,
  records: Record<string, string>
): Promise<string[]> {
  const prompt = `
You are an expert puzzle master. Given the following input and records, determine which clues should be accepted.
If the input includes all key information from a clue, that clue should be accepted.

Input: "${input}"

Records:
${Object.entries(records).map(([id, clue]) => `- ID: ${id}, Clue: ${clue}`).join("\n")}

Return a JSON object with a single field "clueIds" which is a list of IDs of the clues that should be accepted based on the input.
    `.trim();

  console.log(`[prompt]`, prompt);

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: ClueEvaluateSchema,
    maxRetries: 1,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 50
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  return object.clueIds;
}

function repairText(text: string): string {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    const output = text.substring(firstBrace, lastBrace + 1);
    return output;
  }
  const output = text
    .replace(/\*\*/g, '')
    .replace(/[\n\r]+/g, " ").trim();
  return output;
}
