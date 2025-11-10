import { list } from "@server/endpoints";
import { proxy } from "valtio";
import { gameViewModel } from "./game";
import { clientLoadStoryData } from "@client/model/clientEngine";
import { startGame } from "@client/model/model";
import { StoryItem } from "@/lib/shared/interfaces";

interface ListViewModel {
  items: StoryItem[];
  fetch(): Promise<void>;
  load(story: string): Promise<void>;
  goto(id: string): Promise<void>;
}

export const listViewModel = proxy<ListViewModel>({
  items: [],
  async fetch() {
    const listData = await list();
    listViewModel.items = listData;
  },
  async load(story: string) {
    gameViewModel.reset();
    gameViewModel.clientGame = true;
    clientLoadStoryData(story);
  },
  async goto(id: string) {
    gameViewModel.reset();
    gameViewModel.clientGame = false;
    await startGame(id);
  }
});
