import { z } from 'zod';
import { supabase } from '@server/services/supabase';
import { parse } from 'yaml';
import { MistData, MistDataSchema } from '@/lib/shared/mist-schema';
import { availableStages } from '../services/stage';

export const MistMistItemSchema = z.object({
  mist_id: z.string().default(''),
  index: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  metadata: z.array(z.string()).nullable(),
  content: z.string().nullable()
});

export type MistMistItem = z.infer<typeof MistMistItemSchema>;

export async function fetchMistMistList(): Promise<MistMistItem[]> {
  const stages = availableStages();
  const { data, error } = await supabase
    .from('mist_mist')
    .select('mist_id, index, title, description, author, tags, metadata, content')
    .in("stage", stages)
    .order("mist_id", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch mist cases: ${error.message}`);
  }

  return data as MistMistItem[];
}

export async function readMistMistData(mistId: string): Promise<MistData | null> {
  const { data, error } = await supabase
    .from('mist_mist')
    .select('content')
    .eq('mist_id', mistId)
    .single();

  if (error) {
    throw new Error(`Failed to read mist case: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const parsed = MistDataSchema.safeParse(parse(data.content));
  if (!parsed.success) {
    throw new Error('Failed to parse mist case content');
  }
  return parsed.data;
}
