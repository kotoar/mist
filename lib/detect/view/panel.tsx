"use client";

import { Box, Flex, VStack, chakra, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { detectViewModel } from "@lib/detect/viewmodel";
import { ArchiveMarkdown } from "@lib/shared/components/archive/markdown";
import { ArchiveComposer } from "@lib/shared/components/archive/composer";
import { GameAction } from "@lib/shared/components/archive/game-topbar";
import { GameRating } from "@lib/shared/components/GameRating";

/** 一条已答讯问记录卡 (铜色左线)。 */
export function LogCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Box borderLeft="2px solid" borderColor="arch.brass" px="14px" py="11px" mb="16px">
      <chakra.div fontFamily="serif" fontWeight="700" fontSize="14.5px" lineHeight="1.7" color="arch.ink" mb="4px">
        <chakra.span fontFamily="mono" fontSize="12px" color="arch.brass">
          Q:{" "}
        </chakra.span>
        {question}
      </chakra.div>
      <ArchiveMarkdown>{answer}</ArchiveMarkdown>
    </Box>
  );
}

/** 结局卡: 完成后的真相故事 + 评分。 */
export function ResultCard() {
  const viewModel = useSnapshot(detectViewModel);
  if (!viewModel.story) return null;
  return (
    <Box border="1px solid" borderColor="arch.rule" p="16px" mb="16px">
      <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mist" mb="10px">
        真相 · 已破案
      </chakra.div>
      <ArchiveMarkdown>{viewModel.story}</ArchiveMarkdown>
      <Box mt="12px">
        <GameRating game="detect" targetId={viewModel.id} />
      </Box>
    </Box>
  );
}

/** 底部讯问输入器 / 反馈区。 */
export function InterrogationPanel() {
  const viewModel = useSnapshot(detectViewModel);
  const router = useRouter();

  // 已完成
  if (!viewModel.currentQuestion && viewModel.story) {
    return (
      <Flex justify="flex-end">
        <GameAction danger onClick={() => { detectViewModel.endGame(); router.push("/"); }}>
          结束游戏
        </GameAction>
      </Flex>
    );
  }

  // 回答正确, 展示标准答案
  if (viewModel.correctFlag && viewModel.standardAnswer) {
    return (
      <VStack align="stretch" gap="10px">
        <chakra.div fontFamily="mono" fontSize="11.5px" letterSpacing="1px" color="arch.mist">
          回答正确
        </chakra.div>
        <ArchiveMarkdown>{viewModel.standardAnswer}</ArchiveMarkdown>
        <Flex justify="flex-end">
          <GameAction onClick={() => detectViewModel.nextQuestion()}>下一题</GameAction>
        </Flex>
      </VStack>
    );
  }

  // 作答中
  return (
    <VStack align="stretch" gap="9px">
      <Show when={viewModel.currentQuestion}>
        <Flex align="baseline" gap="10px">
          <chakra.span fontFamily="mono" fontSize="11px" letterSpacing="1px" color="arch.mut" whiteSpace="nowrap">
            {viewModel.currentIndex}
          </chakra.span>
          <chakra.span fontFamily="serif" fontWeight="700" fontSize="15px" lineHeight="1.7" color="arch.ink">
            {viewModel.currentQuestion}
          </chakra.span>
        </Flex>
      </Show>
      <Show when={viewModel.wrongFlag}>
        <chakra.div fontFamily="mono" fontSize="11.5px" letterSpacing="0.5px" color="arch.red">
          回答错误 ({viewModel.percentage} / 100)
        </chakra.div>
        <Show when={viewModel.hint}>
          <chakra.div fontFamily="serif" fontSize="13.5px" color="arch.red">
            {viewModel.hint}
          </chakra.div>
        </Show>
      </Show>
      <Show when={!!viewModel.currentQuestion}>
        <ArchiveComposer
          value={viewModel.input}
          onChange={(v) => (detectViewModel.input = v)}
          onSubmit={() => detectViewModel.submit()}
          loading={!viewModel.interactable}
        />
      </Show>
    </VStack>
  );
}
