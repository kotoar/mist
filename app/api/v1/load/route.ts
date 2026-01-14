import { z } from "zod";
import { magicCodeCheck } from "@/lib/api/magic-code-check";
import { readRequestBody } from "@/lib/api/request-reader";
import { supabase } from "@/lib/server/services/supabase";

const magicCode = "load_magic_code";

const ApiRequestSchema = z.object({
  type: z.enum(["case", "detect", "mist"]),
  id: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  if (!magicCodeCheck(body, magicCode)) {
    return new Response(JSON.stringify({ error: "Invalid Request" }), { status: 403 });
  }
  const requestData = await readRequestBody(body, ApiRequestSchema);
  if (!requestData) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  // Load logic here
  switch (requestData.type) {
    case "case":
    case "detect": {
        const caseData = await readCaseData(requestData.id);
        if (!caseData) {
          return new Response(JSON.stringify({ error: "Case not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ data: caseData }), { status: 200 });
      }
    case "mist": {
        const mistData = await readMistData(requestData.id);
        if (!mistData) {
          return new Response(JSON.stringify({ error: "Mist not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ data: mistData }), { status: 200 });
      }
    default:
      return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400 });
  }
}

async function readCaseData(caseId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('mist_case')
    .select('content')
    .eq('case_id', caseId)
    .single();
  if (error) { return null; }
  return data.content as string;
}

async function readMistData(mistId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('mist_mist')
    .select('content')
    .eq('mist_id', mistId)
    .single();
  if (error) { return null; }
  return data.content as string;
}
