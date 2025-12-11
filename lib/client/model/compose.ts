"use client";

import { readComposeData, submit } from "@server/compose/endpoints";
import { composeViewModel } from "@client/viewmodel/compose";

export class ComposeDelegate {
  static instance = new ComposeDelegate();

  storyId?: string;
  async load(storyId: string): Promise<void> {
    const data = await readComposeData(storyId);
    if (!data) { return; }
    this.storyId = storyId;
    composeViewModel.load(data);
  }
  async submit(index: number, input: string): Promise<void> {
    if (!this.storyId) { return; }
    composeViewModel.interactable = false;
    const response = await submit({ storyId: this.storyId, index, input });
    composeViewModel.success = response?.success ?? false;
    composeViewModel.valid = response?.valid ?? false;
    composeViewModel.message = response?.invalidReason || response?.ending;
    composeViewModel.interactable = true;
  }
}
