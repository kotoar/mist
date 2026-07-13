"use client";

import { Flex, VStack, chakra, Show } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import { mistViewModel } from "@lib/mist/viewmodel";
import { ArchiveComposer } from "@lib/shared/components/archive/composer";
import { GameAction } from "@lib/shared/components/archive/game-topbar";

/** 迷雾底部: 尝试次数 + 思路方向开关 + 假设验证输入器。 */
export function MistPanel() {
  const viewModel = useSnapshot(mistViewModel);
  return (
    <VStack align="stretch" gap="9px">
      <Flex align="center" gap="12px">
        <chakra.span fontFamily="mono" fontSize="12px" letterSpacing="1px" color="arch.red" whiteSpace="nowrap">
          已尝试 {viewModel.count} 次
        </chakra.span>
        <Show when={viewModel.message}>
          <chakra.span fontFamily="serif" fontSize="13px" color="arch.red">
            {viewModel.message}
          </chakra.span>
        </Show>
        <chakra.span flex="1" />
        <GameAction onClick={() => (mistViewModel.showMistHints = !mistViewModel.showMistHints)}>
          显示思路方向 · {viewModel.showMistHints ? "开" : "关"}
        </GameAction>
      </Flex>
      <ArchiveComposer
        value={viewModel.input}
        onChange={(v) => (mistViewModel.input = v)}
        onSubmit={() => mistViewModel.submit()}
        loading={!viewModel.interactable}
        placeholder="输入你的假设进行验证…(回车提交,Shift+回车换行)"
      />
    </VStack>
  );
}
