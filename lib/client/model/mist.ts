"use client";

import { end, skip, start, submit } from "@server/mist/endpoints";
import { mistViewModel } from "@client/viewmodel/mist";

export class MistDelegate {
  static instance = new MistDelegate();

  sessionId?: string;
  storyId?: string;

  async load(storyId: string): Promise<void> {
    this.storyId = storyId;
    this.sessionId = localStorage.getItem(`sessionId:${storyId}`) || undefined;
    const response = await start({ sessionId: this.sessionId, storyId: this.storyId });
    if (!response) { return; }
    this.sessionId = response.sessionId;
    localStorage.setItem(`sessionId:${storyId}`, this.sessionId);
    mistViewModel.load(response);
  }

  async submit(input: string): Promise<void> {
    if (!this.sessionId) { return; }
    const response = await submit({ sessionId: this.sessionId, input });
    if (!response) { return; }

    if (response.answer) {
      mistViewModel.story = response.answer;
    }

    if (response.revealed.length === 0) {
      mistViewModel.message = response.hint;
      return;
    }

    if (mistViewModel.view === "puzzle") {
      mistViewModel.indicated = true;
    }
    mistViewModel.indicatedId = response.revealed.map(clue => clue.id);

    const updateSections = deepClone(mistViewModel.sections)
    response.revealed.forEach(clue => {
      const section = updateSections.find(sec => sec.clues.some(c => c.id === clue.id));
      if (!section) { return; }
      const clueData = section.clues.find(c => c.id === clue.id);
      if (!clueData) { return; }
      clueData.content = clue.content;
    });
    mistViewModel.sections = updateSections;
  }

  async skip(): Promise<void> {
    if (!this.sessionId) { return; }
    const response = await skip(this.sessionId);
    if (!response) { return; }
    mistViewModel.story = response.answer;

    const updateSections = deepClone(mistViewModel.sections)
    response.revealed.forEach(clue => {
      const section = updateSections.find(sec => sec.clues.some(c => c.id === clue.id));
      if (!section) { return; }
      const clueData = section.clues.find(c => c.id === clue.id);
      if (!clueData) { return; }
      clueData.content = clue.content;
    });
    mistViewModel.sections = updateSections;
  }

  endGame() {
    if (!this.sessionId) { return; }
    end(this.sessionId);
    localStorage.removeItem(`sessionId:${this.storyId}`);
    this.storyId = undefined;
    this.sessionId = undefined;
  }
}

function deepClone<T>(sections: T): T {
  return JSON.parse(JSON.stringify(sections));
}
