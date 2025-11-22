import { proxy } from "valtio";
import { MistStartResponse } from "@shared/mist-interface";
import { MistDelegate } from "@client/model/mist";

export interface ClueRepresent {
  id: string;
  hint?: string;
  content?: string;
}

export interface SectionRepresent {
  id: string;
  title?: string;
  clues: readonly ClueRepresent[];
}

export function sectionCompleted(section: SectionRepresent): boolean {
  return section.clues.every(clue => clue.content !== undefined);
}

interface MistViewModel {
  view: "puzzle" | "clues";
  title: string;
  puzzle: string;
  sections: SectionRepresent[];
  story?: string;
  input: string;
  indicated: boolean;
  indicatedId: string[];
  message?: string;
  interactable: boolean;
  count: number;
  showMistHints: boolean;

  load(bundle: MistStartResponse): void;
  submit(): void;
  skip(): void;
  endGame(): void;
}

export const mistViewModel = proxy<MistViewModel>({
  view: "puzzle",
  title: "",
  puzzle: "",
  sections: [],
  story: undefined,
  input: "",
  indicated: false,
  indicatedId: [],
  message: undefined,
  interactable: true,
  count: 0,
  showMistHints: false,

  load(bundle: MistStartResponse) {
    mistViewModel.title = bundle.title;
    mistViewModel.puzzle = bundle.puzzle;
    mistViewModel.sections = bundle.sections.map(section => ({
      id: section.id,
      title: section.title,
      clues: section.clueIds.map(id => {
        const clueData = bundle.clues.find(clue => clue.id === id);
        return {
          id,
          hint: clueData?.hint,
          content: clueData?.content,
        };
      }),
    }));
    mistViewModel.story = bundle.story;
    mistViewModel.input = "";
    mistViewModel.indicatedId = [];
    mistViewModel.message = undefined;
    mistViewModel.indicated = false;
    mistViewModel.interactable = true;
    mistViewModel.count = 0;
  },

  submit() {
    const input = mistViewModel.input.trim();
    mistViewModel.input = "";
    mistViewModel.message = undefined;
    mistViewModel.indicatedId = [];
    mistViewModel.interactable = false;
    MistDelegate.instance.submit(input).then(() => {
      mistViewModel.interactable = true;
      mistViewModel.count += 1;
    });
  },

  skip() {
    MistDelegate.instance.skip();
  },

  endGame() {
    MistDelegate.instance.endGame();
  },
});
