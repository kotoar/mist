import { proxy } from "valtio";

export interface NovelListItem {
  id: string;
  title: string;
  aiRate: string;
  author?: string;
  tags: readonly string[];
}

interface NovelViewModel {
  id: string;
  list: readonly NovelListItem[];
  content: string;
}

export const novelViewModel = proxy<NovelViewModel>({
  id: "",
  list: [
    {
      id: "novel-n01",
      title: "N01 未署名的附录",
      aiRate: "70%",
      author: "天色盐",
      tags: ["本格"],
    }
  ],
  content: "",
});
