"use client";

import { Dialog, Portal, CloseButton, chakra } from "@chakra-ui/react";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";

export function GuideButtonView() {
  return (
    <Dialog.Root size="lg" placement="center">
      <Dialog.Trigger asChild>
        <chakra.button
          type="button"
          fontFamily="mono"
          fontSize="12px"
          letterSpacing="1px"
          color="arch.brass"
          bg="transparent"
          border="0"
          px="3px"
          py="2px"
          cursor="pointer"
          whiteSpace="nowrap"
          transition="background 0.15s"
          _hover={{ bg: "arch.hov" }}
        >
          [侦探手册]
        </chakra.button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="arch.panel"
            color="arch.ink"
            border="1px solid"
            borderColor="arch.rule"
            borderRadius="0"
            boxShadow="none"
          >
            <Dialog.Header borderBottom="1px solid" borderColor="arch.rule">
              <Dialog.Title fontFamily="serif" fontWeight="700" letterSpacing="2px" color="arch.ink">
                迷雾档案《侦探手册》
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body py="18px">
              <ArchiveMarkdown>{guide}</ArchiveMarkdown>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton color="arch.brass" borderRadius="0" _hover={{ bg: "arch.hov" }} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

const guide = `
欢迎来到迷雾档案！在这里，你将扮演一名侦探，挑战各种扑朔迷离的案件。为了帮助你更好地理解游戏模式和玩法，我们为你准备了这本侦探手册。

我们的目标是**作为侦探的你**能在**15-20分钟**内体验一个短篇幅的案件，同时享受推理解谜的乐趣。

### Cxx 档案模式：演绎
- **特点**：不需要任何的额外知识，所有的信息都能通过逻辑推理以及基础常识得出。
- **游戏体验**：整体游戏围绕由已知线索推导出真相展开。
- **案件类型**：均为本格或者新本格，如有超自然要素(较少见)一定会在案件的开篇声明。

### Axx 档案模式：探案
- **特点**：需要一定的探案的知识和经验，包含法医、物理、心理学等常见领域。
- **游戏体验**：整体游戏围绕取证，调查展开，推理部分相对较少。
- **案件类型**：均为本格或者新本格，如有超自然要素(较少见)一定会在案件的开篇声明。

### Mxx 迷雾模式
- **特点**：推理过程是不严密的，玩家需要不断的提出新的假设，然后输入进行验证。
- **游戏体验**：整体游戏没有太多限制，玩家可以自由发挥想象力。
- **案件类型**：多以新本格和变格为主，一般会有超自然要素或者非常识的设定，并且玩家在推理之前并不会知道这些设定。
`;
