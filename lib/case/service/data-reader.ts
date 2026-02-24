import { z } from "zod";
import { parse } from "yaml";
import { CaseData, CaseDataSchema } from "@lib/case/schema";
import { supabase } from "@lib/shared/services/supabase";
import { availableStages } from "@lib/shared/services/stage";

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
    cover: z.string().nullable(),
    rating_score: z.number().nullable().default(0),
    rating_count: z.number().nullable().default(0),
});

export type MistCaseItem = z.infer<typeof MistCaseItemSchema>;

export async function fetchMistCaseList(): Promise<MistCaseItem[]> {
    const stages = availableStages();
    const { data, error } = await supabase
        .from('mist_case')
        .select('case_id, created_at, index, title, description, author, tags, metadata, cover, game, difficulty, rating_score, rating_count')
        .in("stage", stages)
        .in("game", ["case", "detect"])
        .order("case_id", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch mist cases: ${error.message}`);
    }

    return data as MistCaseItem[];
}

/** Reads case/detect data from the mist_case table. Used by both case and detect modules. */
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

export async function readStoryData(storyId: string): Promise<CaseData | null> {
    return readMistCaseData(storyId);
}
