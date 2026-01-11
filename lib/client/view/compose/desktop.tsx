"use client";

import { useSnapshot } from "valtio";
import { Container, VStack, Text, For, Show, Button, HStack, Heading, Box, ProgressCircle, Spacer, useBreakpointValue } from "@chakra-ui/react";
import { composeViewModel } from "@client/viewmodel/compose";
import { ComposeDelegate } from "@client/model/compose";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { useRef, useEffect, useState } from "react";

export function DesktopComposeView() {
  const viewModel = useSnapshot(composeViewModel);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bottomVStackRef = useRef<HTMLDivElement>(null);
  const [bottomHeight, setBottomHeight] = useState(150);

  useEffect(() => {
    if (bottomVStackRef.current) {
      setBottomHeight(bottomVStackRef.current.offsetHeight);
    }
  }, [viewModel.message, viewModel.valid, viewModel.success, viewModel.selectedIndex, isMobile]);

  function handleSubmit(index: number) {
    if (index === undefined) return;
    if (viewModel.input.trim() === "") return;
    if (!viewModel.interactable) return;
    ComposeDelegate.instance.submit(index, composeViewModel.input);
  }

  return (
    <Container maxW="4xl" height="100vh">
      <VStack align="stretch" fontFamily='"Noto Serif TC", serif' fontWeight={650} width="full" height="full" paddingY="20px">
        <Heading size="lg" fontFamily='"Noto Serif TC", serif' fontWeight={800}>{viewModel.title}</Heading>
        <Text whiteSpace="pre-wrap">{viewModel.setup}</Text>
        <Box>
          <For each={viewModel.sentences}>
            {(sentence, index) => (
              <Text
                key={index}
                as="span"
                whiteSpace="pre-wrap"
                cursor="pointer"
                marginRight="8px"
                bg={viewModel.selectedIndex === index ? { _dark: "red.600", _light: "red.100" } : { _dark: "yellow.800", _light: "yellow.100" }}
                onClick={() => composeViewModel.selectedIndex = index}
              >{sentence.subject}{sentence.content}</Text>
            )}
          </For>
        </Box>
        <Text whiteSpace="pre-wrap" color="fg.muted">{viewModel.originalEnding}</Text>
        <Spacer minH={`${bottomHeight}px`} />
        <VStack
          ref={bottomVStackRef}
          position={{ base: "fixed", md: "sticky" }} bottom={{ base: "0", md: "10px" }} left={0} right={0}
          align="stretch" gap="10px" padding="10px"
          border="1px solid" borderColor="bg.emphasized" borderRadius="md" bg="bg.muted"
        >
          <Show when={viewModel.message || viewModel.success || !viewModel.valid}>
            <VStack align="start" gap="5px" width="full">
              <Show when={viewModel.message}>
                <Text whiteSpace="pre-wrap">{viewModel.message}</Text>
              </Show>
              <Show when={viewModel.success}>
                <Text color="green.500">恭喜你，完成了创作！</Text>
              </Show>
              <Show when={!viewModel.valid}>
                <Text color="red.500" fontWeight="bold">修改不符合逻辑!</Text>
              </Show>
            </VStack>
          </Show>
          <Show when={viewModel.selectedIndex !== undefined && isMobile}>
            <Text whiteSpace="nowrap">
              {viewModel.sentences[viewModel.selectedIndex!]?.subject || ""}
            </Text>
          </Show>
          <HStack align="start">
            <Show when={viewModel.selectedIndex !== undefined && !isMobile}>
              <Text whiteSpace="nowrap" paddingTop="7px">
                {viewModel.sentences[viewModel.selectedIndex!]?.subject || ""}
              </Text>
            </Show>
            <IMESafeInput
              type="textarea"
              textareaProps={{
                placeholder: "最多输入20个字",
                maxLength: 20,
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(viewModel.selectedIndex!);
                  }
                }
              }}
              value={viewModel.input}
              onChange={(e) => composeViewModel.input = e}
            />
            <Button
              variant="solid"
              disabled={viewModel.selectedIndex === undefined || viewModel.input.trim() === "" || !viewModel.interactable}
              onClick={() => handleSubmit(viewModel.selectedIndex!)}
            >
              <Show when={!viewModel.interactable}>
                <ProgressCircle.Root value={null} size="xs">
                  <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range />
                  </ProgressCircle.Circle>
                </ProgressCircle.Root>
              </Show>
              提交创作
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
}