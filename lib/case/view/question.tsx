"use client";

import { Box, VStack, Show, chakra } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import { ArchiveComposer } from "@lib/shared/components/archive/composer";
import { QuestionViewModel } from "@lib/case/viewmodel";

/** 一道推理问题卡: 已解则铜线 + 答案, 未解则细线 + 输入器。 */
export function QuestionView({ question }: { question: QuestionViewModel }) {
  const viewModel = useSnapshot(question);
  const solved = !!viewModel.answer;

  return (
    <Box
      borderLeft="2px solid"
      borderColor={solved ? "arch.brass" : "arch.rule"}
      px="15px"
      py="12px"
      transition="border-color 0.15s"
    >
      <chakra.div fontFamily="serif" fontWeight="700" fontSize="15px" lineHeight="1.7" color="arch.ink" mb="8px">
        {viewModel.question}
      </chakra.div>
      <Show when={solved}>
        <chakra.div fontFamily="serif" fontSize="13.5px" lineHeight="1.85" color="arch.dim">
          {viewModel.answer}
        </chakra.div>
      </Show>
      <Show when={!solved}>
        <VStack align="stretch" gap="8px">
          <Show when={viewModel.wrongFlag}>
            <chakra.div fontFamily="mono" fontSize="11.5px" letterSpacing="0.5px" color="arch.red">
              不完全正确。进度：{viewModel.percentage}%
            </chakra.div>
          </Show>
          <ArchiveComposer
            value={viewModel.input}
            onChange={(v) => question.updateInput(v)}
            onSubmit={() => question.submit()}
            loading={!viewModel.interactable}
            rows={1}
            placeholder="写下你的推理…(回车提交,Shift+回车换行)"
          />
        </VStack>
      </Show>
    </Box>
  );
}
