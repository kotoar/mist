import { supabase } from "@/lib/server/services/supabase";
import { z } from "zod";
import { magicCodeCheck } from "@/lib/api/magic-code-check";

const ApiMistItemSchema = z.object({
  mist_id: z.string().default(''),
  index: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  metadata: z.array(z.string()).nullable(),
  cover: z.string().nullable()
});
type ApiMistItem = z.infer<typeof ApiMistItemSchema>;

interface ApiResponse {
  mists: ApiMistItem[];
}

const magicCode = "mist_list_magic_code";

export async function POST(request: Request) {
  const body = await request.json();
  if (!magicCodeCheck(body, magicCode)) {
    return new Response(JSON.stringify({ error: "Invalid Request" }), { status: 403 });
  }

  const { data, error } = await supabase
    .from('mist_mist')
    .select('mist_id, index, title, description, author, tags, metadata, cover')
    .in("stage", ["prod"])
    .order("mist_id", { ascending: true });

  if (error) {
    console.error("Error fetching mist list:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch mist list" }), { status: 500 });
  }

  const parsed = data.map((row) => {
    const parsed = ApiMistItemSchema.safeParse(row);
    if (!parsed.success) {
      console.error("Error parsing mist item:", parsed.error, "Row:", row);
      return null;
    }
    return parsed.data;
  }).filter((item): item is ApiMistItem => item !== null);

  const response: ApiResponse = {
    mists: parsed,
  };

  return new Response(JSON.stringify(response), { status: 200 });
}
