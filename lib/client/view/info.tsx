import { Dialog, Portal, Text, Icon, IconButton } from "@chakra-ui/react";
import { MdOutlineInfo } from "react-icons/md";

export function InfoView({size = "md"}: {size?: "xs" | "sm" | "md"}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton aria-label="Game Info" size={size} colorPalette="blue" variant="outline">
          <Icon as={MdOutlineInfo} />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>迷雾档案</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>这是一个侦探解谜游戏。在游戏中，你将面对各种谜题和线索，通过推理和分析来揭开真相。祝你好运，侦探！</Text>
              <Text>这里的每一步推理并非严密无误，而是需要你不断验证和调整。</Text>
              <Text>如果从已知的信息里实在找不出答案，可以尝试提出新的假设，分析在这种情况下，最有可能的真相会是什么。</Text>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}