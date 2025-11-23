"use client";

import { end, next, start, submit } from "@server/detect/endpoints";
import { detectViewModel } from "@client/viewmodel/detect";

export class DetectDelegate {
  static instance = new DetectDelegate();

  sessionId?: string;
  storyId?: string;

  async load(storyId: string): Promise<void> {
    this.storyId = storyId;
    this.sessionId = localStorage.getItem(`sessionId:${storyId}`) || undefined;
    const response = await start({ sessionId: this.sessionId, storyId: this.storyId });
    if (!response) { return; }
    this.sessionId = response.sessionId;
    localStorage.setItem(`sessionId:${storyId}`, this.sessionId);
    detectViewModel.load(response);
  }
  async submit(input?: string): Promise<void> {
    const sessionId = this.sessionId;
    if (!sessionId) { return; }
    const response = await submit(sessionId, input);
    if (!response) { return; }
    if (response.answer) {
      detectViewModel.currentAnswer = response.answer;
      detectViewModel.currentFinished = true;
    } else {
      detectViewModel.currentFinished = false;
    }
    if (response.story) {
      detectViewModel.story = response.story;
    }
  }
  async next(): Promise<void> {
    if (detectViewModel.story) {
      detectViewModel.currentFinished = undefined;
      return;
    }
    const sessionId = this.sessionId;
    if (!sessionId) { return; }
    const response = await next(sessionId);
    if (!response) { return; }
    detectViewModel.logs = [
      ...detectViewModel.logs,
      {
        question: detectViewModel.currentQuestion || "",
        answer: detectViewModel.currentAnswer || "",
      },
    ];
    detectViewModel.currentIndex = response.index;
    detectViewModel.currentQuestion = response.question;
    detectViewModel.currentAnswer = undefined;
    detectViewModel.currentFinished = undefined;
    detectViewModel.input = "";
  }
  endGame() {
    if (!this.sessionId) { return; }
    end(this.sessionId);
    localStorage.removeItem(`sessionId:${this.storyId}`);
    this.storyId = undefined;
    this.sessionId = undefined;
  }
}
