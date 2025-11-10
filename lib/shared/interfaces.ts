export interface BundleResponse {
  sessionId: string;
  puzzle: string;
  clues: (string | undefined)[];
}

export interface ClueRequest {
  sessionId: string;
  input: string;
}

export interface ClueResponse {
  clues: (string | undefined)[];
  answer?: string;
}
