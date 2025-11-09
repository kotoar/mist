import { proxy } from "valtio";
import { submitClue } from "./model";

interface MainViewModel {
  puzzle?: string;
  clues: (string | undefined)[];
  answer?: string;
  input: string;
  submit(): void;
}

const defaultPuzzle = `
“您面临 —— 来自杀罪的指控，神父先生”

“我罪有应得。”

“真的不做任何辩护吗？警察和您的信众们都希望搞清楚到底发生了什么，您为什么不和他们说说呢？”

“并不需要。”

“唉……您真是一位可敬的牧羊人，但可惜，您现在的愿望是实现不了的。”

“我听不懂你在说什么。”

“您杀死的那个可怜的醉鬼，他刚来到这座小镇两周而已。”

沉默

“顺便一提，我当律师以前是个警察，而且恰好和这个醉鬼是同乡哦”

沉默 以及 一双盯着面前人的眼睛

“？？？？？”

“魔鬼！魔鬼！”
`;

export const mainViewModel = proxy<MainViewModel>({
  puzzle: defaultPuzzle,
  clues: Array(15).fill(undefined),
  answer: undefined,
  input: "",
  submit() {
    // Submission logic to be implemented
    console.log("Submitted input:", this.input);
    submitClue(mainViewModel.input);
    mainViewModel.input = "";
  }
});
