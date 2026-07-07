"use client";

import { start, submit } from "@lib/mist/service/endpoints";
import { mistViewModel } from "@lib/mist/viewmodel";
import { MistStartResponse } from "@lib/mist/schema";
import { track } from "@vercel/analytics";

interface StoredClue {
  id: string;
  hint?: string;
  trigger: string;
  content: string;
}

interface MistLocalState {
  storyId: string;
  solvedIds: string[];
}

const STORAGE_KEY_PREFIX = "mist:";

function readLocalState(storyId: string): MistLocalState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${storyId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.storyId === storyId && Array.isArray(parsed.solvedIds)) {
        return parsed;
      }
    }
  } catch { }
  return { storyId, solvedIds: [] };
}

function saveLocalState(storyId: string, state: MistLocalState): void {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${storyId}`, JSON.stringify(state));
}

function clearLocalState(storyId: string): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${storyId}`);
}

export class MistDelegate {
  static instance = new MistDelegate();

  storyId?: string;
  /** Full clue data from server (triggers, content, hints) — kept in memory only */
  allClues: StoredClue[] = [];
  localState: MistLocalState = { storyId: "", solvedIds: [] };
  storyData?: MistStartResponse;

  async load(storyId: string): Promise<void> {
    this.storyId = storyId;
    mistViewModel.status = "loading";

    let response;
    try {
      response = await start(storyId);
    } catch {
      mistViewModel.status = "error";
      return;
    }
    if (!response) { mistViewModel.status = "missing"; return; }

    this.storyData = response;
    this.allClues = response.clues;
    this.localState = readLocalState(storyId);

    const completed = this.localState.solvedIds.length >= this.allClues.length;

    mistViewModel.load({
      id: storyId,
      title: response.title,
      puzzle: response.puzzle,
      story: completed ? response.story : undefined,
      clues: response.clues.map(clue =>
        this.localState.solvedIds.includes(clue.id)
          ? { id: clue.id, content: `【${clue.trigger}】\n ${clue.content}` }
          : { id: clue.id, hint: clue.hint }
      ),
      sections: response.sections,
    });

    track("mist_start", { story: storyId });
  }

  async submit(input: string): Promise<void> {
    if (!this.storyId || !this.storyData) { return; }

    const unsolvedClues = this.allClues
      .filter(clue => !this.localState.solvedIds.includes(clue.id));

    if (unsolvedClues.length === 0) { return; }

    const response = await submit({
      storyId: this.storyId,
      input,
      solvedIds: this.localState.solvedIds,
      puzzle: this.storyData.puzzle,
      story: this.storyData.story || "",
      clues: unsolvedClues.map(c => ({ id: c.id, trigger: c.trigger })),
    });
    if (!response) { return; }

    if (response.revealed.length === 0) {
      mistViewModel.message = response.hint;
      return;
    }

    // Update local state with newly solved clue IDs
    this.localState.solvedIds = [...new Set([...this.localState.solvedIds, ...response.revealed])];
    saveLocalState(this.storyId, this.localState);

    const completed = this.localState.solvedIds.length >= this.allClues.length;
    if (completed) {
      mistViewModel.story = this.storyData.story;
      track("mist_solved", { story: this.storyId });
    }

    if (mistViewModel.view === "puzzle") {
      mistViewModel.indicated = true;
    }
    mistViewModel.indicatedId = response.revealed;

    const updateSections = deepClone(mistViewModel.sections);
    response.revealed.forEach(id => {
      const clueData = this.allClues.find(c => c.id === id);
      if (!clueData) { return; }
      const section = updateSections.find(sec => sec.clues.some(c => c.id === id));
      if (!section) { return; }
      const clueRepresent = section.clues.find(c => c.id === id);
      if (!clueRepresent) { return; }
      clueRepresent.content = `【${clueData.trigger}】\n ${clueData.content}`;
    });
    mistViewModel.sections = updateSections;
  }

  skip(): void {
    if (!this.storyId || !this.storyData) { return; }

    // Reveal all clues locally
    this.localState.solvedIds = this.allClues.map(c => c.id);
    saveLocalState(this.storyId, this.localState);

    mistViewModel.story = this.storyData.story;

    track("mist_skipped", { story: this.storyId });

    const updateSections = deepClone(mistViewModel.sections);
    this.allClues.forEach(clue => {
      const section = updateSections.find(sec => sec.clues.some(c => c.id === clue.id));
      if (!section) { return; }
      const clueRepresent = section.clues.find(c => c.id === clue.id);
      if (!clueRepresent) { return; }
      clueRepresent.content = `【${clue.trigger}】\n ${clue.content}`;
    });
    mistViewModel.sections = updateSections;
  }

  endGame(): void {
    if (!this.storyId) { return; }
    clearLocalState(this.storyId);
    this.storyId = undefined;
    this.allClues = [];
    this.localState = { storyId: "", solvedIds: [] };
    this.storyData = undefined;
  }
}

function deepClone<T>(sections: T): T {
  return JSON.parse(JSON.stringify(sections));
}
