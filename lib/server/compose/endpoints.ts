"use server";

import { ComposeSubmitRequest, ComposeSubmitResponse } from "@shared/compose-interface";
import { ComposeData, ComposeDataSchema } from "@shared/compose-schema";
import { judgeC } from "./judge";
import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { track } from "@vercel/analytics/server";

export async function submit(request: ComposeSubmitRequest): Promise<ComposeSubmitResponse | null> {
  const story = await readComposeData(request.storyId, false);
  if (!story) { return null; }
  const response = await judgeC(request.index, request.input, story);
  if (!response) { return null; }
  return {
    valid: response.valid,
    invalidReason: response.invalidReason,
    success: response.success,
    ending: response.ending,
  }
}

export async function readComposeData(storyId: string, firstFlag: boolean = true): Promise<ComposeData | null> {
  const filePath = path.join(process.cwd(), "public", "story", `${storyId}.yaml`);
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = ComposeDataSchema.safeParse(parse(fileContent));
    if (!data.success) { 
      console.error(`Invalid compose data schema for story ID ${storyId}:`, data.error);
      return null;
    }
    if (firstFlag) {
      track("compose_start", { composeId: storyId });
    }
    return data.data;
  } catch (error) {
    console.error(`Error reading compose data file at ${filePath}:`, error);
    return null;
  }
}
