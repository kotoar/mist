"use client";

import { Box, Dialog, Flex, Portal, CloseButton, chakra } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArchiveMarkdown } from "./markdown";
import { GameAction } from "./game-topbar";
import { GameRating } from "@lib/shared/components/GameRating";

/** 完成一局后的「结案」横幅: 铜框 + [阅读结局故事] 打开档案对话框(结局 + 评分 + 结束游戏)。 */
export function StoryComplete({
  story,
  game,
  targetId,
  onEnd,
}: {
  story: string;
  game: "case" | "detect" | "mist";
  targetId: string;
  onEnd: () => void;
}) {
  const router = useRouter();
  const end = () => {
    onEnd();
    router.push("/");
  };

  return (
    <Box border="1px solid" borderColor="arch.brass" px="16px" py="14px" mt="8px" bg="arch.hov">
      <Flex align="center" justify="space-between" gap="12px" wrap="wrap">
        <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mist">
          结案 · 已破解全部谜题
        </chakra.span>
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
              px="4px"
              py="2px"
              cursor="pointer"
              whiteSpace="nowrap"
              transition="background 0.15s"
              _hover={{ bg: "arch.hov" }}
            >
              [阅读结局故事]
            </chakra.button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop bg="blackAlpha.700" />
            <Dialog.Positioner>
              <Dialog.Content bg="arch.panel" color="arch.ink" border="1px solid" borderColor="arch.rule" borderRadius="0" boxShadow="none">
                <Dialog.Header borderBottom="1px solid" borderColor="arch.rule">
                  <Dialog.Title fontFamily="serif" fontWeight="700" letterSpacing="2px" color="arch.ink">
                    结局故事
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body py="18px">
                  <ArchiveMarkdown>{story}</ArchiveMarkdown>
                  <Box mt="16px">
                    <GameRating game={game} targetId={targetId} />
                  </Box>
                </Dialog.Body>
                <Dialog.Footer borderTop="1px solid" borderColor="arch.rule">
                  <GameAction danger onClick={end}>
                    结束游戏
                  </GameAction>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton color="arch.brass" borderRadius="0" _hover={{ bg: "arch.hov" }} />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </Flex>
    </Box>
  );
}
