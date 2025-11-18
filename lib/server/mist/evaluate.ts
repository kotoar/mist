import { z } from "zod";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { MistContext } from "@server/mist/context";
import { repairText } from "@server/services/ai-utils";

export async function evaluate(props:{
  input: string,
  context: MistContext
}): Promise<string[]> {
  const { input, context } = props;
  const toBeEvaluated = context.storyData.clues.filter(clue => 
    !context.userData.solvedIds.includes(clue.id)
  ).map(clue => ({ id: clue.id, trigger: clue.trigger }));

    const prompt = `
你是一个谜题游戏的判定专家工具。
玩家会被给予一个谜题，以及若干线索，每个线索都有一个判定标准。
对于玩家的输入内容，你要判断是否有线索被揭开。

### 玩家输入内容：
"${input}"

### 线索列表：
${toBeEvaluated.map(clue => `- [ID] ${clue.id};[判定标准]${clue.trigger}`).join("\n")}

### 谜题：
${context.storyData.puzzle}

### 故事背景:
${context.storyData.story}

### 判定标准：
- 玩家输入内容的语义和线索内容的语义一致
- 关键原则：宁可过度严格，绝不误判

## 返回格式:返回被判定为揭开的线索ID列表,格式如下:
{"clueIds": [线索ID列表]}
    `.trim();

  const { object } = await generateObject({
    model: google("gemini-2.5-flash-lite"),
    prompt: prompt,
    schema: ClueEvaluateSchema,
    maxRetries: 1,
    temperature: 0.1,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 512
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  return object.clueIds;
}

const ClueEvaluateSchema = z.object({
  clueIds: z.array(z.string())
    .default([])
    .describe("List of clue IDs that were accepted"),
});
