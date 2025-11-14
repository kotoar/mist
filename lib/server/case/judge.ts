import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { CaseJudge, CaseJudgeSchema } from "@shared/case-interface";
import { repairText } from "@server/services/ai-utils";

export async function judge(props:{
  input: string,
  question: string,
  referenceAnswer: string,
  keys: string[],
  story: string
}): Promise<CaseJudge> {
  const { input, question, referenceAnswer, keys, story } = props;
  const prompt = [
    "你是一位极其严格的谜题评估专家。对于一个问题，玩家的输入自己的回答，你要判断玩家的答案是否正确。",

    `### 问题
    ${question}`,

    `### 玩家输入内容: 
    ${input}`,

    `### 参考答案：
    ${referenceAnswer}`,

    keys.length === 0 ? "" :
    `### 关键点：
    ${keys.map((key, index) => `${index + 1}. ${key}`).join("\n")}`,

    `### 谜题背景：
    ${story}`,

    `### 判定标准：
    - 玩家输入内容的语义和参考答案的语义一致
    - 玩家输入内容包含的关键点会大大提升答案的正确性评分`,

    `### 输出格式：
    {
      "correct": true | false, // 玩家答案是否正确
      "score": number, // 玩家答案的得分，范围0-100
    }`
  ].filter(Boolean).join("\n\n");

  const response = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: CaseJudgeSchema,
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

  return response.object;
}
