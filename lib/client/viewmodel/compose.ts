import { ComposeData } from "@/lib/shared/compose-schema";
import { proxy } from "valtio";

interface ComposeViewModel {
  title: string;
  setup: string;
  sentences: readonly { subject: string; content: string }[];
  originalEnding: string;
  interactable: boolean;
  selectedIndex?: number;
  input: string;
  message?: string;
  success: boolean;
  valid: boolean;
  load(data: ComposeData): void;
}

export const composeViewModel = proxy<ComposeViewModel>({
  title: "",
  setup: "",
  sentences: [],
  originalEnding: "",

  interactable: true,  
  selectedIndex: undefined,
  input: "",  
  message: undefined,
  success: false,
  valid: true,
  load(data: ComposeData) {
    this.title = data.title;
    this.setup = data.setup;
    this.sentences = data.sentences;
    this.originalEnding = data.ending;
    this.selectedIndex = undefined;
    this.input = "";
    this.message = undefined;
    this.success = false;
    this.valid = true;
    this.interactable = true;
  }
});
