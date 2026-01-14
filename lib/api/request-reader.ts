import { z } from "zod";

export async function readRequestBody<T>(body: object, schema: z.ZodType<T>): Promise<T | null> {
  try {
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.error("Error parsing request body:", parsed.error);
      return null;
    }
    return parsed.data;
  } catch (error) {
    console.error("Error reading request body:", error);
    return null;
  }
}