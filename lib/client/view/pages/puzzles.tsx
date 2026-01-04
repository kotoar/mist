"use client";

import { Container, VStack, Text, Spacer, Card, Heading, Wrap, Image, Blockquote } from "@chakra-ui/react";
import Link from "next/link";
import { PageNavigator } from "@client/view/components/title";

export function PuzzleListView() {
  return (
    <Container maxW="6xl" height="100vh">
      <VStack align="stretch" height="full" gap="20px" padding="20px">
        <PageNavigator type="puzzles" />
        <Blockquote.Root>
          <Blockquote.Content whiteSpace="pre-wrap" color="fg.muted" fontSize="sm">
            网页解密游戏是近年来兴起的一种互动式谜题体验形式。玩家通过浏览网页、解读线索、破解密码，逐步揭开隐藏在故事背后的秘密。
            {`\n`}
            请多加使用游戏内的搜索功能，揭开作者设置的各种谜题。
          </Blockquote.Content>
        </Blockquote.Root>
        <Wrap>
          <Link href="https://street7.mistcase.app" passHref target="_blank" rel="noopener noreferrer">
            <PuzzlePreviewView />
          </Link>
        </Wrap>
      </VStack>
    </Container>
  );
}

function PuzzlePreviewView() {
  const description = `三天前，季晚失踪了。
你发给她的消息石沉大海，电话关机。
直到今晚，你的邮箱里没有收到警方的立案回执，反而收到了一张来自陌生机构的电子催款单。`;
  return (
    <Card.Root size="sm" maxW="400px">
      <Image src="/puzzles/street7.png" alt="Cover Image" borderTopRadius="md" objectFit="cover" maxH="150px" />
      <Card.Body>
        <VStack align="stretch" gap="4px" width="full">
          <Wrap align="start">
            <Heading size="sm">《命栽七号街》</Heading>
            <Spacer />
            <Text fontSize="sm">1 - 1.5小时</Text>
          </Wrap>
          <Text color="fg.subtle" fontSize="sm" whiteSpace="pre-wrap">
            {description}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
