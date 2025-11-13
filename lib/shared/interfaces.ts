export interface StoryItem {
  id: string;
  title: string;
  author?: string;
  description?: string;
  tags: readonly string[];
}

export interface ClueRepresent {
  id: string;
  hint?: string;
  clue?: string;
}

export interface SectionBundle {
  title?: string;
  clues: string[];
}

export interface BundleResponse {
  sessionId: string;
  puzzle: string;
  sections: SectionBundle[];
  clues: ClueRepresent[];
}

export interface ClueRequest {
  sessionId: string;
  input: string;
}

export interface ClueResponse {
  clues: ClueRepresent[];
  unlockedIds: string[];
  answer?: string;
}
