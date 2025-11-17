import { proxy } from "valtio";
import { CasePreview } from "@shared/case-schema";
import { list } from "@/lib/server/case/endpoints";

interface ListViewModel {
  type: "case" | "mist";
  items: CasePreview[];
  fetch(): Promise<void>;
}

export const listViewModel = proxy<ListViewModel>({
  type: "case",
  items: [],
  async fetch() {
    const listData = await list();
    listViewModel.items = listData;
  }
});
