import { z } from "zod";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { MistContext } from "@server/mist/context";
import { repairText } from "@server/services/ai-utils";

export async function evaluate(props: {
  input: string,
  context: MistContext
}): Promise<{ revealed: string[], hint?: string }> {
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

async function evaluateImpl(props: {
  input: string,
  triggers: { id: string; trigger: string }[],
  puzzle: string,
  story: string,
}): Promise<{ revealed: string[], hint?: string }> {
  const { input, triggers, puzzle, story } = props;

  const prompt = `
你是一个谜题游戏的判定工具。你的目标是"宁可不触发，也不要误触发"。

对玩家输入进行判定时：
- 只有当玩家输入中出现与线索判定标准中的关键短语逐字一致的内容时才算揭开线索。
- 关键短语包括：证物名、人物名、地点、编号、时间、确切数值、特定动作短语等。禁止仅凭语义相似或常识推断触发。
- 默认返回空列表；如果不确定或缺乏逐字匹配的关键短语，则不触发。
- 为每条触发的线索提供来自玩家输入的原文证据短语（evidence），这些短语必须是玩家输入里的原文子串，且能对应到判定标准中的关键点。优先选择专有名词或唯一性强的词语。
- 如果没有任何线索被触发，必须提供hint字段，给出有帮助的提示。

### 提示(hint)生成规则：
当玩家猜测失败时，请根据以下情况生成相应的提示：

1. **方向正确，但细节不足**：如果玩家的思路接近某条线索，但缺少关键信息
   - 提示：直接告诉玩家缺少的信息是什么
   - 例如："你已经接近了！试着提到[缺失的关键点]，这可能会帮你更进一步。"

2. **完全偏离方向**：如果玩家的输入与所有线索都无关
   - 提示：给出其中一个trigger相关的提示
   - 例如："不妨再仔细看看谜题描述，关注一下[提示某个关键领域]。"

3. **语义接近但用词不准确**：如果玩家表达的意思接近，但没有使用关键短语
   - 提示：直接告诉玩家准确的用词应该是什么
   - 例如："你想到的东西很接近了！试着用'[正确的关键短语]'来描述它。"

提示要求：
- 根据玩家输入的具体内容定制提示，而非通用话语
- 提示长度控制在一句话（不超过20字），简洁有力，直指要点，可以透露出关键信息
- 如果能判断玩家的思路方向，可以给出更具体的引导
- 不要提到**“触发”**或**“线索”**等游戏机制术语【很重要，否则你作为一个判定工具会失败】

示例（简化）：
- 线索：[ID] A; [判定标准] 找到"红色钥匙"
  - 玩家输入："我看到红色盒子和钥匙孔" 
    -> 不触发，hint: "你注意到了正确的颜色和相关物品！再想想这两者之间有什么联系？"
  - 玩家输入："我在柜子里找到了红色钥匙" 
    -> 触发 A，evidence: ["红色钥匙","柜子"]
  - 玩家输入："密码是1234"
    -> 不触发，hint: "密码的方向可能不对。试着想想是否有更直接的物理线索？"

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
  ],
  "hint": "给玩家的有针对性的提示信息（必填，即使matches为空）"
}
  `.trim();

  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: ClueEvaluateSchema,
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

  // 服务器端严格校验：仅保留证据为玩家输入中“逐字子串”的匹配
  const normalize = (s: string) => s
    .trim()
    .replace(/[\u3000\s]+/g, '') // 移除中文空格和普通空格
    .toLowerCase(); // 如果需要不区分大小写

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

  console.log("[hint]: ", object.hint);

  return { revealed: validIds, hint: object.hint };
}

// 将输出结构调整为包含证据，便于做严格校验
const ClueEvaluateSchema = z.object({
  matches: z.array(z.object({
    id: z.string(),
    evidence: z.array(z.string()).default([]).describe("来自玩家输入的原文子串，用于证明触发。"),
  })).default([]),
  hint: z.string().describe("给玩家的有针对性的提示信息，分析其输入并引导正确方向"),
});
