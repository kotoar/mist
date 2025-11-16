import { proxy } from "valtio";
import { CasePreview } from "@shared/case-schema";
import { list } from "@/lib/server/case/endpoints";

interface ListViewModel {
  items: CasePreview[];
  fetch(): Promise<void>;
}

export const listViewModel = proxy<ListViewModel>({
  items: [],
  async fetch() {
    const listData = await list();
    listViewModel.items = listData;
  }
});
