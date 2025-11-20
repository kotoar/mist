import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { CaseJudge, CaseJudgeSchema } from "@shared/case-interface";
import { repairText } from "@server/services/ai-utils";

export async function judge(props:{
  input: string,
  question: string,
  referenceAnswer: string,
  puzzle: string,
  story: string
}): Promise<CaseJudge> {
  const { input, question, referenceAnswer, puzzle, story } = props;
  const prompt = [
    "你是一位极其严格、保守且不臆测的谜题答案评估专家。任务：判定玩家回答是否与参考答案语义等价，并给出客观分数。绝不因为出现单个关键词就判正确，绝不补全或脑补未出现的信息。",
    `### 问题
    ${question}`,
    `### 玩家输入
    ${input}`,
    `### 参考答案
    ${referenceAnswer}`,
    `### 谜题
    ${puzzle}`,
    `### 故事真相
    ${story}`,
    `### 评估流程（严格执行）：
    1. 归一化：忽略大小写、标点、空格、语序、常见停用词、名字的分隔符；允许同义替换（如“找到”≈“发现”）。
    2. 在问题里抽取出希望玩家回答的【核心要素】。
    3. 抽取参考答案的核心要素：关键实体、条件、逻辑关系、结论点、数量/限定词。
    4. 抽取玩家输入的对应要素。
    5. 比对：
       - 核心要素是否全部覆盖。
       - 是否存在与参考答案冲突/否定/自相矛盾信息。
       - 是否出现与题意无关的臆测且影响答案正确性。
       - 对于人物，名字，姓氏，昵称，称谓等均视为同一实体。（从上下文推断）
    5. 判定 correct：仅当核心要素完整且无冲突、无实质性错误。可以有轻微的细微表述/次要修饰不同，但不影响整体语义。
    6. 评分 score（0-100，整数）：
       - 100：核心事实与逻辑全部匹配，无遗漏，无冲突。
       - 80-99：语义等价，缺少次要修饰/限定语（如程度、轻重、细微目的）但主结论完整。
       - 60-79：核心结论正确，但缺少多个次要要素或轻度不完整。
       - 40-59：只覆盖部分关键点，存在较大缺失。
       - 1-39：大量缺失或出现错误/不相关臆测。
       - 0：完全错误、与参考答案相反、空内容、仅复述题干、随机/含明显无意义片段。
    7. 不要因为出现少量关键词就给高分；需整体语义匹配。
    8. 如果玩家答案给出多个互斥可能且未明确正确项，则判 false 并低分。
    9. 不要输出解释文本，只输出 JSON。
    ### 补充姓名匹配规则：
    - 姓名归一化时移除分隔符（“·”, “-”, “_”, 空格）。
    - 若参考答案仅给出名或姓，而玩家给出完整姓名（例如 参考：伊莎贝拉；玩家：伊莎贝拉·布莱克伍德），视为同一人物且不判定为臆测。
    - 只要玩家姓名包含参考姓名的核心部分，即判定覆盖（如“伊莎贝拉·布莱克伍德”覆盖“伊莎贝拉”）。
    - 附加姓氏或全名仅在与故事已知事实明确冲突时才算错误；否则不得因此降低分数或判错。
    - 不因出现更详细的人名形式而判 false。
    ### 补充意图判定规则：
    - 意图分层：主意图（动机类别，如“报复”）为核心；次要限定（程度、仅让其不适、方式细节）为次要要素。
    - 问题询问“意图”时，玩家回答包含主意图即可判定核心覆盖；缺少次要限定不判错，可评 80-99。
    - 仅当玩家回答的意图与参考主意图冲突（如参考：报复；玩家：谋杀 / 获取财产）或明显更严重（将轻度不适说成致命）才判定错误或降分。
    - 同义视为等价（报复≈复仇；让其不适≈让其难受/身体不舒服）。
    - 不可自行脑补未出现的更具体手段；若玩家未提及参考中的温和限定，不视为缺失核心。`,
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
    temperature: 0.05,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 700
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  return response.object;
}
