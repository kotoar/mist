import { proxy } from "valtio";
import { caseList } from "@server/case/endpoints";
import { CasePreview } from "@shared/case-schema";
import { MistPreview } from "@shared/mist-schema";
import { mistList } from "@/lib/server/mist/endpoints";

interface ListViewModel {
  _type: "case" | "mist";
  type: "case" | "mist";
  cases: CasePreview[];
  mists: MistPreview[];
  fetch(): Promise<void>;
}

export const listViewModel = proxy<ListViewModel>({
  _type: "case",
  get type() {
    return this._type;
  },
  set type(value: "case" | "mist") {
    this._type = value;
    if (value === "case" && this.cases.length === 0) {
      caseList().then(data => listViewModel.cases = data);
    } else {
      mistList().then(data => listViewModel.mists = data);
    }
  },
  cases: [],
  mists: [],
  async fetch() {
    const listData = await caseList();
    listViewModel.cases = listData;
  }
});
