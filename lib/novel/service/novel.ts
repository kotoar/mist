"use server";

import { track } from "@vercel/analytics/server";
import fs from "fs";
import path from "path";

export async function readNovelContent(novelId: string): Promise<string> {
  const novelPath = path.join(process.cwd(), "public", "novel", `${novelId}.md`);
  try {
    const content = fs.readFileSync(novelPath, "utf-8");
    track("novel_viewed", { novelId });
    return content;
  } catch (error) {
    console.error(`Error reading novel file at ${novelPath}:`, error);
    return "";
  }
}