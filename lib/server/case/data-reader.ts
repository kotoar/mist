import { z } from "zod";
import { parse } from "yaml";
import { CaseData, CaseDataSchema } from "@shared/case-schema";
import { supabase } from "@server/services/supabase";
import { availableStages } from "@server/services/stage";

export const MistCaseItemSchema = z.object({
  case_id: z.string().default(''),
  game: z.enum(["case", "detect"]).default("case"),
  difficulty: z.string().nullable().default(null),
  index: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  metadata: z.array(z.string()).nullable(),
  content: z.string().nullable(),
  cover: z.string().nullable(),
});

export type MistCaseItem = z.infer<typeof MistCaseItemSchema>;

export async function fetchMistCaseList(): Promise<MistCaseItem[]> {
  const stages = availableStages();
  const { data, error } = await supabase
    .from('mist_case')
    .select('case_id, created_at, index, title, description, author, tags, metadata, content, cover, game, difficulty')
    .in("stage", stages)
    .in("game", ["case", "detect"])
    .order("case_id", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch mist cases: ${error.message}`);
  }

  return data as MistCaseItem[];
}

export async function readMistCaseData(caseId: string): Promise<CaseData | null> {
  const { data, error } = await supabase
    .from('mist_case')
    .select('content')
    .eq('case_id', caseId)
    .single();

  if (error) {
    throw new Error(`Failed to read mist case: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const parsed = CaseDataSchema.safeParse(parse(data.content));
  if (!parsed.success) {
    throw new Error('Failed to parse mist case content');
  }
  return parsed.data;
}
