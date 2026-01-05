"use client";

import { proxy } from "valtio";
import { caseList } from "@server/list/case-list";
import { CasePreview } from "@shared/case-schema";
import { MistPreview } from "@shared/mist-schema";
import { mistList } from "@/lib/server/list/case-list";

export type PageType = "home" | "case" | "mist" | "lab" | "puzzles";

interface ListViewModel {
  caseFilter: "all" | "detect" | "case";
  cases: CasePreview[];
  get showCases(): CasePreview[];
  mists: MistPreview[];
  fetch(type: "case" | "mist"): Promise<void>;
}

export const listViewModel = proxy<ListViewModel>({
  cases: [] as CasePreview[],
  caseFilter: "all",
  mists: [],

  get showCases() {
    if (this.caseFilter === "all") {
      return this.cases;
    } else {
      return this.cases.filter((c: CasePreview) => c.game === this.caseFilter);
    }
  },

  async fetch(type: "case" | "mist") {
    switch (type) {
      case "case":
        this.cases = await caseList();
        break;
      case "mist":
        this.mists = await mistList();
        break;
    }
  }
});
