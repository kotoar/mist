"use client";

import { useSnapshot } from "valtio";
import { Box, Flex, For, VStack, chakra, Show } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { composeViewModel } from "@lib/compose/viewmodel";
import { ComposeDelegate } from "@lib/compose/model";
import { ArchiveComposer } from "@lib/shared/components/archive/composer";
import { GameTopbar, GameThemeToggle, GameAction } from "@lib/shared/components/archive/game-topbar";

export function DesktopComposeView() {
  const viewModel = useSnapshot(composeViewModel);
  const router = useRouter();

  function handleSubmit() {
    const index = composeViewModel.selectedIndex;
    if (index === undefined) return;
    if (viewModel.input.trim() === "") return;
    if (!viewModel.interactable) return;
    ComposeDelegate.instance.submit(index, composeViewModel.input);
  }

  const selectedSubject =
    viewModel.selectedIndex !== undefined ? viewModel.sentences[viewModel.selectedIndex]?.subject ?? "" : "";

  return (
    <Box h="100vh" overflow="hidden" display="flex" flexDirection="column">
      <GameTopbar
        label={`${viewModel.title} · 演绎`}
        actions={
          <>
            <GameThemeToggle />
            <GameAction danger onClick={() => router.push("/lab")}>
              结束游戏
            </GameAction>
          </>
        }
      />
      <Box flex="1" minH="0" overflowY="auto">
        <Box maxW="720px" mx="auto" px={{ base: "20px", md: "40px" }} pt="34px" pb="220px">
          <chakra.div fontFamily="mono" fontSize="11px" letterSpacing="2px" textTransform="uppercase" color="arch.mut">
            演绎 · 改写
          </chakra.div>
          <chakra.h1
            fontFamily="serif"
            fontWeight="900"
            fontSize="clamp(26px,3vw,36px)"
            letterSpacing="3px"
            m="12px 0 16px"
            pb="16px"
            borderBottom="3px double"
            borderColor="arch.rule"
            color="arch.ink"
          >
            {viewModel.title}
          </chakra.h1>

          <chakra.p fontFamily="serif" fontSize="15.5px" lineHeight="2.05" color="arch.dim" whiteSpace="pre-wrap" m="0 0 16px">
            {viewModel.setup}
          </chakra.p>

          <chakra.div fontFamily="serif" fontSize="15.5px" lineHeight="2.05" color="arch.dim" mb="16px">
            <For each={viewModel.sentences}>
              {(sentence, index) => {
                const selected = viewModel.selectedIndex === index;
                return (
                  <chakra.span
                    key={index}
                    cursor="pointer"
                    whiteSpace="pre-wrap"
                    bg={selected ? "arch.hov" : "transparent"}
                    borderBottom="1px dashed"
                    borderColor={selected ? "arch.brass" : "arch.rule"}
                    color={selected ? "arch.ink" : "inherit"}
                    transition="background 0.15s"
                    _hover={{ bg: "arch.hov" }}
                    onClick={() => (composeViewModel.selectedIndex = index)}
                  >
                    {sentence.subject}
                    {sentence.content}
                  </chakra.span>
                );
              }}
            </For>
          </chakra.div>

          <chakra.p fontFamily="serif" fontSize="15.5px" lineHeight="2.05" color="arch.mut" whiteSpace="pre-wrap" m="0">
            {viewModel.originalEnding}
          </chakra.p>
        </Box>
      </Box>

      {/* 底部改写器 */}
      <Box borderTop="1px solid" borderColor="arch.rule" bg="arch.panel">
        <Box maxW="720px" mx="auto" px={{ base: "20px", md: "40px" }} py="14px">
          <VStack align="stretch" gap="9px">
            <Show when={viewModel.message || viewModel.success || !viewModel.valid}>
              <Box>
                <Show when={viewModel.message}>
                  <chakra.div fontFamily="serif" fontSize="13.5px" color="arch.dim" whiteSpace="pre-wrap">
                    {viewModel.message}
                  </chakra.div>
                </Show>
                <Show when={viewModel.success}>
                  <chakra.div fontFamily="mono" fontSize="11.5px" letterSpacing="1px" color="arch.mist">
                    恭喜你，完成了创作！
                  </chakra.div>
                </Show>
                <Show when={!viewModel.valid}>
                  <chakra.div fontFamily="mono" fontSize="11.5px" letterSpacing="1px" color="arch.red">
                    修改不符合逻辑！
                  </chakra.div>
                </Show>
              </Box>
            </Show>
            <Flex align="center" gap="10px">
              <Show when={viewModel.selectedIndex !== undefined}>
                <chakra.span fontFamily="serif" fontWeight="700" fontSize="14px" color="arch.ink" whiteSpace="nowrap">
                  {selectedSubject}
                </chakra.span>
              </Show>
              <chakra.span flex="1">
                <ArchiveComposer
                  value={viewModel.input}
                  onChange={(v) => (composeViewModel.input = v)}
                  onSubmit={handleSubmit}
                  disabled={viewModel.selectedIndex === undefined}
                  loading={!viewModel.interactable}
                  rows={1}
                  maxLength={20}
                  placeholder={viewModel.selectedIndex === undefined ? "先点选一句要改写的话…" : "最多输入 20 个字"}
                  submitLabel="提交创作"
                />
              </chakra.span>
            </Flex>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
