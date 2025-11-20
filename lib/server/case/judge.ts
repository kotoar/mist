import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { CaseJudge, CaseJudgeSchema } from "@shared/case-interface";
import { repairText } from "@server/services/ai-utils";

export async function judge(props:{
  input: string,
  question: string,
  referenceAnswer: string,
  story: string
}): Promise<CaseJudge> {
  const { input, question, referenceAnswer, story } = props;
  const prompt = [
    "你是一位极其严格、保守且不臆测的谜题答案评估专家。任务：判定玩家回答是否与参考答案语义等价，并给出客观分数。绝不因为出现单个关键词就判正确，绝不补全或脑补未出现的信息。",
    `### 问题
    ${question}`,
    `### 玩家输入
    ${input}`,
    `### 参考答案
    ${referenceAnswer}`,
    `### 谜题背景
    ${story}`,
    `### 评估流程（严格执行）：
    1. 归一化：忽略大小写、标点、空格、语序、常见停用词；允许同义替换（如“找到”≈“发现”）。
    2. 抽取参考答案的核心要素：关键实体、条件、逻辑关系、结论点、数量/限定词。
    3. 抽取玩家输入的对应要素。
    4. 比对：
       - 核心要素是否全部覆盖。
       - 是否存在与参考答案冲突/否定/自相矛盾信息。
       - 是否出现与题意无关的臆测且影响答案正确性。
    5. 判定 correct：仅当核心要素完整且无冲突、无实质性错误。缺少任何核心要素或出现错误即 false。
    6. 评分 score（0-100，整数）：
       - 100：核心事实与逻辑全部匹配，无遗漏，无冲突。
       - 80-99：语义等价，细微表述/次要修饰不同，无错误。
       - 60-79：核心结论正确，但缺少次要要素或轻度不完整。
       - 40-59：只覆盖部分关键点，存在较大缺失。
       - 1-39：大量缺失或出现错误/不相关臆测。
       - 0：完全错误、与参考答案相反、空内容、仅复述题干、随机/含明显无意义片段。
    7. 不要因为出现少量关键词就给高分；需整体语义匹配。
    8. 如果玩家答案给出多个互斥可能且未明确正确项，则判 false 并低分。
    9. 不要输出解释文本，只输出 JSON。`,
    `### 输出格式（仅此 JSON，不添加额外字符）：
    {
      "correct": true | false,
      "score": number
    }`
  ].filter(Boolean).join("\n\n");

  const response = await generateObject({
    model: google("gemini-2.5-flash-lite"),
    prompt: prompt,
    schema: CaseJudgeSchema,
    maxRetries: 1,
    temperature: 0.2,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 512
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  return response.object;
}
