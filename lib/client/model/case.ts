"use client";

import { end, start, submit } from "@/lib/server/case/endpoints";
import { gameViewModel } from "@/lib/client/viewmodel/case";

export class ContextDelegate {
  static instance = new ContextDelegate();

  sessionId?: string;
  storyId?: string;

  async load(storyId: string): Promise<void> {
    this.storyId = storyId;
    this.sessionId = localStorage.getItem(`sessionId:${storyId}`) || undefined;
    const response = await start({ sessionId: this.sessionId, storyId: this.storyId });
    if (!response) { return; }
    this.sessionId = response.sessionId;
    localStorage.setItem(`sessionId:${storyId}`, this.sessionId);
    gameViewModel.load(response);
  }
  async submit(sessionId: string, questionId: string, input: string): Promise<void> {
    const response = await submit({ sessionId, questionId, input });
    if (!response) { return; }
    const question = gameViewModel.questions.find(q => q.id === questionId);
    if (!question) { return; }
    if (response.correct) {
      question.answer = response.answer;
      question.wrongFlag = false;
    } else {
      question.wrongFlag = true;
      question.percentage = response.score;
    }
    gameViewModel.story = response.story;
  }
  endGame() {
    if (!this.sessionId) { return; }
    end(this.sessionId);
    localStorage.removeItem(`sessionId:${this.storyId}`);
    this.storyId = undefined;
    this.sessionId = undefined;
  }
}
