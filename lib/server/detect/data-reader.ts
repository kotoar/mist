import { z } from "zod";
import { parse } from "yaml";
import { CaseData, CaseDataSchema } from "@shared/case-schema";
import { supabase } from "@server/services/supabase";
import { availableStages } from "@server/services/stage";

export const MistCaseItemSchema = z.object({
  case_id: z.string().default(''),
  title: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  metadata: z.array(z.string()).nullable(),
  content: z.string().nullable()
});

export type MistCaseItem = z.infer<typeof MistCaseItemSchema>;

export async function fetchMistCaseList(): Promise<MistCaseItem[]> {
  const stages = availableStages();
  const { data, error } = await supabase
    .from('mist_case')
    .select('case_id, created_at, title, description, author, tags, metadata, content')
    .in("stage", stages)
    .order("case_id", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch mist cases: ${error.message}`);
  }

  return data as MistCaseItem[];
}

export async function readMistDetectData(caseId: string): Promise<CaseData | null> {
  const { data, error } = await supabase
    .from('mist_case')
    .select('content')
    .eq('case_id', caseId)
    .eq("game", "detect")
    .maybeSingle();

  if (error) {
    console.error(`Failed to read mist case: ${error.message}`);
    return null;
  }

  if (!data) {
    return null;
  }

  const parsed = CaseDataSchema.safeParse(parse(data.content));
  if (!parsed.success) {
    console.error('Failed to parse mist case content:', parsed.error);
    return null;
  }
  return parsed.data;
}
