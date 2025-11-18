import { CaseData, CaseDataSchema } from '@/lib/shared/case-schema';
import { z } from 'zod';
import { supabase } from '../services/supabase';
import { parse } from 'yaml';

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
  const { data, error } = await supabase
    .from('mist_case')
    .select('case_id, created_at, title, description, author, tags, metadata, content')
    .eq("stage", "prod")
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
