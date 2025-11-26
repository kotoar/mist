import { useSnapshot } from "valtio";
import { novelViewModel } from "./viewmodel";
import { Container } from "@chakra-ui/react";
import { Prose } from "@/components/ui/prose";
import Markdown from "react-markdown";

export function NovelView() {
  const viewModel = useSnapshot(novelViewModel);

  return (
    <Container maxW="3xl" padding="20px">
      <Prose>
        <Markdown>{viewModel.content}</Markdown>
      </Prose>
    </Container>
  );
}