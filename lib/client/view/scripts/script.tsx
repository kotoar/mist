"use client";

import { useSnapshot } from "valtio";
import { scriptViewModel } from "@client/viewmodel/scripts";
import { Container, Text, VStack, Wrap } from "@chakra-ui/react";
import { Prose } from "@/components/ui/prose";
import Markdown from "react-markdown";
import { PageTitleLink } from "@client/view/components/title";
import { Divider } from "@client/view/components/divider";

export function ScriptView() {
  const viewModel = useSnapshot(scriptViewModel);
  return (
    <Container maxW="4xl" padding="20px">
      <VStack align="start" gap="20px">
        <Wrap gap="15px" align="end">
          <PageTitleLink />
          <Text fontSize="lg">推理游戏剧本</Text>
        </Wrap>
        <Divider />
        <Prose color="fg">
          <Markdown>{viewModel.script}</Markdown>
        </Prose>
      </VStack>
    </Container>
  );
}
