import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { repairText } from "@server/services/ai-utils";
import { DetectJudge, DetectJudgeSchema } from "@/lib/shared/detect-interface";

export async function judgeB(props:{
  input: string,
  question: string,
  referenceAnswer: string,
  puzzle: string,
  story: string
}): Promise<DetectJudge> {
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
    - 如果参考答案里有附加规则，遵守参考答案里的规则。
    #### 评分 score（0-100，整数）：
      - 100：主要关键词全部匹配，无遗漏，无冲突。
      - 70-99：核心结论正确，但缺少多个次要要素或轻度不完整。
      - 40-69：只覆盖部分关键点，存在较大缺失。
      - 1-39：大量缺失或出现错误/不相关臆测。
      - 0：完全错误、与参考答案相反、空内容、仅复述题干、随机/含明显无意义片段。
    #### 提示 hint（可选）：
      - 如果答案不正确，给出简短提示，指出玩家回答中缺失或错误的关键点（指出方向）。
      - 如果答案正确，则不需要提供提示。`
  ].filter(Boolean).join("\n\n");

  const response = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: DetectJudgeSchema,
    maxRetries: 1,
    temperature: 0.05,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 80
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  return response.object;
}
