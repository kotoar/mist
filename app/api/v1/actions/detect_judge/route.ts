import { z } from "zod";
import { readRequestBody } from "@lib/shared/api/request-reader";
import { magicCodeCheck } from "@lib/shared/api/magic-code-check";
import { judge } from "@lib/case/service/judge";

const magicCode = "detect_judge_magic_code";

const ApiRequestSchema = z.object({
  input: z.string(),
  question: z.string(),
  referenceAnswer: z.string(),
  puzzle: z.string(),
  story: z.string()
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

  const result = await judge({ ...requestData, includeHint: true });

  return new Response(JSON.stringify({ data: result }), { status: 200 });
}
