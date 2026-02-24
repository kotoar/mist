import { z } from "zod";

const ApiMagicCodeRequestSchema = z.object({
  magic_code: z.string().default(""),
});

export function magicCodeCheck(body: object, magicCode: string): boolean {
  const parsedRequest = ApiMagicCodeRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return false;
  }
  if (parsedRequest.data.magic_code !== magicCode) {
    return false;
  }
  return true;
}