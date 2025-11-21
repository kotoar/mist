import { z } from "zod";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { MistContext } from "@server/mist/context";
import { repairText } from "@server/services/ai-utils";

export async function evaluate(props:{
  input: string,
  context: MistContext
}): Promise<string[]> {
  return await evaluateImpl({
    input: props.input,
    triggers: props.context.storyData.clues
      .filter(clue => props.context.userData.solvedIds.includes(clue.id) === false)
      .map(clue => ({
        id: clue.id,
        trigger: clue.trigger,
      })),
    puzzle: props.context.storyData.puzzle,
    story: props.context.storyData.story || "",
  });
}

async function evaluateImpl(props:{
  input: string,
  triggers: { id: string; trigger: string }[],
  puzzle: string,
  story: string,
}): Promise<string[]> {
  const { input, triggers, puzzle, story } = props;

  const prompt = `
你是一个谜题游戏的判定工具。你的目标是“宁可不触发，也不要误触发”。

对玩家输入进行判定时：
- 只有当玩家输入中出现与线索判定标准中的关键短语逐字一致的内容时才算揭开线索。
- 关键短语包括：证物名、人物名、地点、编号、时间、确切数值、特定动作短语等。禁止仅凭语义相似或常识推断触发。
- 默认返回空列表；如果不确定或缺乏逐字匹配的关键短语，则不触发。
- 为每条触发的线索提供来自玩家输入的原文证据短语（evidence），这些短语必须是玩家输入里的原文子串，且能对应到判定标准中的关键点。优先选择专有名词或唯一性强的词语。

示例（简化）：
- 线索：[ID] A; [判定标准] 找到“红色钥匙”
  - 玩家输入：“我看到红色盒子和钥匙孔” -> 不触发（没有“红色钥匙”逐字匹配）
  - 玩家输入：“我在柜子里找到了红色钥匙” -> 触发 A，evidence 例如 ["红色钥匙","柜子"]

### 玩家输入内容：
"${input}"

### 线索列表：
${triggers.map(clue => `- [ID] ${clue.id}; [判定标准] ${clue.trigger}`).join("\n")}

### 谜题：
${puzzle}

### 故事背景:
${story}

### 判定标准（必须全部满足）：
- 玩家输入出现与线索判定标准中关键短语的逐字匹配
- 【重要】整体语义和判定标准中的语义完全相符，不能缺少部分语义
- 不依赖推断或常识补全；仅凭玩家输入文本本身证据判定
- 若无把握，请返回空

## 返回格式（JSON）：
{
  "matches": [
    { "id": 线索ID, "evidence": ["玩家输入中的原文片段1","原文片段2", ...] }
  ]
}
  `.trim();

  const { object } = await generateObject({
    model: google("gemini-2.5-flash-lite"),
    prompt: prompt,
    schema: ClueEvaluateSchema,
    maxRetries: 1,
    temperature: 0.05,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 1500
        },
      },
    },
    experimental_repairText: async (options) => repairText(options.text),
  });

  // 服务器端严格校验：仅保留证据为玩家输入中“逐字子串”的匹配
  const normalize = (s: string) => s.trim();
  const normalizedInput = normalize(input);
  const validIds = (object.matches || [])
    .filter(m =>
      m.id &&
      Array.isArray(m.evidence) &&
      m.evidence.length > 0 &&
      m.evidence.every(ev => {
        const e = normalize(ev);
        return e.length >= 2 && normalizedInput.includes(e);
      })
    )
    .map(m => m.id);

  return validIds;
}

// 将输出结构调整为包含证据，便于做严格校验
const ClueEvaluateSchema = z.object({
  matches: z.array(z.object({
    id: z.string(),
    evidence: z.array(z.string()).default([]).describe("来自玩家输入的原文子串，用于证明触发。"),
  })).default([]),
});
