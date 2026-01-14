import { magicCodeCheck } from "@/lib/api/magic-code-check";
import { supabase } from "@/lib/server/services/supabase";
import { z } from "zod";

const magicCode = "case_list_magic_code";

const ApiCaseItemSchema = z.object({
  case_id: z.string().default(''),
  game: z.enum(["case", "detect"]).default("case"),
  difficulty: z.string().nullable().default(null),
  index: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  cover: z.string().nullable(),
});
type ApiCaseItem = z.infer<typeof ApiCaseItemSchema>;

interface ApiResponse {
  cases: ApiCaseItem[];
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!magicCodeCheck(body, magicCode)) {
    return new Response(JSON.stringify({ error: "Invalid Request" }), { status: 403 });
  }

  const { data, error } = await supabase
    .from('mist_case')
    .select('case_id, created_at, index, title, description, author, tags, cover, game, difficulty')
    .in("stage", ["prod"])
    .in("game", ["detect"])
    .limit(50)
    .order("case_id", { ascending: true });

  if (error) {
    console.error("Error fetching case list:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch case list" }), { status: 500 });
  }

  const parsed = data.map((row) => {
    const parsed = ApiCaseItemSchema.safeParse(row);
    if (!parsed.success) {
        console.error("Error parsing case item:", parsed.error, "Row:", row);
        return null;
    }
    return parsed.data;
  }).filter((item): item is ApiCaseItem => item !== null);

  const response: ApiResponse = {
    cases: parsed,
  };

  return new Response(JSON.stringify(response), { status: 200 });
}
