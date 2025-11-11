"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { Clue } from "@shared/schema";

const ClueEvaluateSchema = z.object({
  clueIds: z.array(z.string())
    .default([])
    .describe("List of clue IDs that were accepted"),
});

export async function evaluateClue(
  input: string,
  records: Clue[]
): Promise<string[]> {
  const prompt = `
你是一位极其严格的谜题评估专家。对于玩家的输入内容，你要判断是否有线索被揭开。

### 玩家输入内容：
"${input}"

### 线索列表：
${records.map(clue => `- [ID] ${clue.id};[线索]${clue.trigger ?? clue.clue}${clue.keys ? `; [关键点] ${clue.keys.join(", ")}` : ""}`).join("\n")}

### 判定标准：
- 玩家输入内容的语义和线索内容的语义一致
- 玩家输入内容包含**所有**的关键点

### 关键原则：宁可过度严格，绝不误判

## 返回格式:返回被判定为揭开的线索ID列表,格式如下:
{"clueIds": [线索ID列表]}
    `.trim();

  console.log("Clue evaluation prompt:", prompt);

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: ClueEvaluateSchema,
    maxRetries: 1,
    temperature: 0.2,
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
