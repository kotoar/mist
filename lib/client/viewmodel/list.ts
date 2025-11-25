"use client";

import { proxy } from "valtio";
import { caseList } from "@server/list/case-list";
import { CasePreview } from "@shared/case-schema";
import { MistPreview } from "@shared/mist-schema";
import { mistList } from "@/lib/server/mist/endpoints";

interface ListViewModel {
  _type: "case" | "mist" | null;
  type: "case" | "mist";
  caseFilter: "all" | "detect" | "case";
  cases: CasePreview[];
  get showCases(): CasePreview[];
  mists: MistPreview[];
  fetch(): Promise<void>;
}

export const listViewModel = proxy<ListViewModel>({
  _type: null,
  get type() {
    if (this._type === null) {
      const storedType = localStorage.getItem("listType") as "case" | "mist";
      if (storedType) {
        this._type = storedType;
        return this._type;
      } else {
        this._type = "case";
        return this._type;
      }
    }
    return this._type;
  },
  set type(value: "case" | "mist") {
    this._type = value;
    localStorage.setItem("listType", value);
    if (value === "case" && this.cases.length === 0) {
      caseList().then(data => listViewModel.cases = data);
    } else {
      mistList().then(data => listViewModel.mists = data);
    }
  },
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

  async fetch() {
    switch (this.type) {
      case "case":
        this.cases = await caseList();
        break;
      case "mist":
        this.mists = await mistList();
        break;
    }
  }
});
