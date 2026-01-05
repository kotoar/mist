import { Prose } from "@/components/ui/prose";
import { VStack } from "@chakra-ui/react";
import Markdown from "react-markdown";

export default function Summary2025Page() {
  return (
    <VStack align="stretch" width="full" gap={4}>
      <Prose color="fg">
        <Markdown>{text}</Markdown>
      </Prose>
    </VStack>
  );
}

const text = `
## 2025 年终总结

2025 年即将过去，感谢大家对《迷雾档案》的支持与陪伴！

我们第一次公开发布是在小红书上，2025年11月18日，一经推出就收获了四位数的访问量和大量积极的反馈。这让我们深刻感受到大家对推理解谜游戏的热情与期待。

在接下来的两个月内，我们陆续的发布了更多的案件和迷雾游戏，包括《阿尔卑斯城堡案件》、《北海道的粉雪》等。以及追寻小红书的热点发布的网页解密游戏《命栽七号街》。

《迷雾档案》作为一个推理游戏集合的企划，旨在为大家提供多样化的推理解谜体验。接下来，我们希望能把更新节奏固定下来，类似其他的推理游戏App，每个月、甚至是每个星期都有固定的新内容更新。

再次感谢大家的支持，祝愿大家在新的一年里健康快乐，解谜愉快！
`;
