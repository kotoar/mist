import { ComposeJudge, ComposeJudgeSchema } from "@/lib/shared/compose-interface";
import { ComposeData } from "@/lib/shared/compose-schema";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { repairText } from "../services/ai-utils";

export async function judgeC(index: number, input: string, data: ComposeData): Promise<ComposeJudge | null> {
  const prompt = `
你是一个文字解谜游戏的裁判系统。
游戏目标：玩家修改案件经过中的一句话，试图引发“蝴蝶效应”来侦破案件。

### <案件背景>
${data.setup}

### 原始<句子列表>
${data.sentences.map((s, i) => `${i + 1}. ${s.subject}：${s.content}`).join("\n")}

### 玩家的修改（索引+内容）
玩家修改的目标索引 (Target Index)
${index + 1} ${data.sentences[index].subject}：${input}

### 判定标准
${data.sentences[index].successCriteria ? `- 成功标准（玩家的修改符合此标准则判定为成功）：${data.sentences[index].successCriteria}` : ""}
${data.sentences[index].failureCriteria ? `- 失败标准（玩家的修改符合此标准则判定为失败）：${data.sentences[index].failureCriteria}` : ""}
- 其他未列出的情况则根据你的判断进行处理

### 你的任务
分析玩家的修改对案件的影响，并输出唯一的 JSON 结果。

**判定逻辑步骤（内部执行，无需输出）：**
1. **逻辑检查**：修改是否符合物理法则和现实逻辑？如果太离谱（如魔法、超人），则判定失败。
2. **因果推演**：
   - 这种修改是否让侦探获得了关键线索？
   - 是否破坏了凶手的作案条件并使其暴露？
   - 是否只是单纯阻止了案件发生（平局），而没有抓到人？（本游戏通常要求“抓到真凶”才算 Success，除非另有说明）。
3. **结局生成**：
   - 如果逻辑错误：用幽默或严厉的口吻指出为什么行不通。
   - 如果失败/平局：描写凶手逃脱或案件陷入僵局的场面。
   - 如果成功：生动描写凶手被抓现行的瞬间。

**输出格式：**
请仅输出一个 JSON 对象，不要包含 Markdown 代码块标记：
{
    "valid": boolean,  // 修改是否符合逻辑
    "invalidReason": string | undefined, // 如果不符合逻辑，说明原因，否则为 undefined
    "success": boolean, // true 表示案件完美解决，false 表示失败、平局或逻辑错误
    "ending": string    // 最终的剧情结局文案（100-200字）
}`;

  const response = await generateObject({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
    schema: ComposeJudgeSchema,
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
