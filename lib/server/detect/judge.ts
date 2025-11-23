import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import { repairText } from "@server/services/ai-utils";

export async function judgeB(props:{
  input: string,
  question: string,
  referenceAnswer: string,
  puzzle: string,
  story: string
}): Promise<boolean> {
  const { input, question, referenceAnswer, puzzle, story } = props;
  const prompt = [
    "你是一位极其严格、保守且不臆测的谜题答案评估专家。任务：判定<玩家输入>是否符合<评价标准>。",
    `### <问题>
    ${question}`,
    `### <玩家输入>
    ${input}`,
    `### <评价标准>
    ${referenceAnswer}`,
    `### 谜题
    ${puzzle}`,
    `### <故事真相>
    ${story}`,

    `### 评估要求
    - 【重要】人物，物品，地点等关键实体可能有多种称呼形式，均视为同一实体。请务必考虑这一点。
    - 如果参考答案里有附加规则，遵守参考答案里的规则。`
  ].filter(Boolean).join("\n\n");

  const response = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: z.object({
      correct: z.boolean().describe("Whether the answer is correct"),
    }),
    maxRetries: 1,
    temperature: 0.05,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 50
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  return response.object.correct;
}
