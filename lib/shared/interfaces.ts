export interface BundleResponse {
  puzzle: string;
}

export interface ClueRequest {
  input: string;
}

export interface ClueResponse {
  clueUpdates: {
    index: number;
    clue: string;
  }[];
  answer?: string;
}
