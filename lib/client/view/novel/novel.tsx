import { useSnapshot } from "valtio";
import { useState } from "react";
import { Button, Container, HStack, Icon, Spacer, Text } from "@chakra-ui/react";
import { Prose } from "@/components/ui/prose";
import Markdown from "react-markdown";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import { track } from "@vercel/analytics";
import { novelViewModel } from "./viewmodel";

export function NovelView() {
  const viewModel = useSnapshot(novelViewModel);
  const [likeSelected, setLikeSelected] = useState<"like" | "dislike" | undefined>(undefined);

  function handleLike() {
    if (likeSelected !== undefined) return;
    setLikeSelected("like");
    track("novel_like", {novelId: novelViewModel.id});
  }

  function handleDislike() {
    if (likeSelected !== undefined) return;
    setLikeSelected("dislike");
    track("novel_dislike", {novelId: novelViewModel.id});
  }

  return (
    <Container maxW="3xl" padding="20px">
      <Prose>
        <Markdown>{viewModel.content}</Markdown>
      </Prose>
      <HStack width="full">
        <Spacer />
        <Button 
          variant={likeSelected === "like" ? "solid" : "outline"}
          onClick={handleLike}
        >
          <Icon as={MdThumbUp} boxSize="24px" />
          <Text>这篇还可以</Text>
        </Button>
        <Button 
          variant={likeSelected === "dislike" ? "solid" : "outline"}
          onClick={handleDislike}
        >
          <Icon as={MdThumbDown} boxSize="24px" />
          <Text>这篇不行</Text>
        </Button>
      </HStack>
    </Container>
  );
}
