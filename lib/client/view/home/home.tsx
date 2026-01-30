"use client";

import { Box, Button, Container, GridItem, Heading, HStack, Icon, SimpleGrid, VStack, Wrap, Text, ScrollArea, For } from "@chakra-ui/react";
import { PageNavigator } from "@client/view/components/title";
import { RecentItem, RecentItemView } from "./recent-item";
import { ScriptsSection } from "./home-scripts";
import Link from "next/link";
import { SiAndroid, SiBilibili, SiTencentqq, SiXiaohongshu } from "react-icons/si";
import { FaArchive, FaEye, FaPuzzlePiece, FaQuestionCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function HomeView() {
  return (
    <Container maxW="6xl" height="100vh" paddingTop="20px">
      <PageNavigator type="home" />
      <VStack width="full" height="full" align="stretch" gap="40px">
        <RecentItemsSection />
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="25px">
          <GridItem>
            <Heading size="lg" marginBottom="10px">聚众推理</Heading>
            <ScriptsSection />
          </GridItem>
          <GridItem>
            <Heading size="lg" marginBottom="10px">开发部</Heading>
            <ConnectionLinksSection />
          </GridItem>
        </SimpleGrid>
        <HStack paddingY="10px" width="full" gap="10px" borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="sm">
            © 2025 MistCase(迷雾档案) by DeepClue
          </Text>
        </HStack>
      </VStack>
    </Container>
  );
}

function RecentItemsSection() {
  return (
    <VStack align="stretch" width="full" gap="10px">
      <Heading size="lg">最近上新</Heading>
      <ScrollArea.Root direction="horizontal" width="full">
        <ScrollArea.Viewport>
          <ScrollArea.Content py="4">
            <HStack gap="20px" align="stretch">
              <For each={recent}>
                {(item, index) => (
                  <RecentItemView
                    key={index}
                    type={item.type} title={item.title} cover={item.cover} date={item.date}
                    author={item.author} url={item.url}
                  />
                )}
              </For>
            </HStack>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
        <ScrollArea.Corner />
      </ScrollArea.Root>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="10px">
        <Link href="/case">
          <Button variant="surface" colorPalette="teal" width="full">
            <Icon as={FaArchive} />
            所有档案
          </Button>
        </Link>
        <Link href="/mist">
          <Button variant="surface" colorPalette="purple" width="full">
            <Icon as={FaQuestionCircle} />
            所有迷雾
          </Button>
        </Link>
        <Link href="/puzzles">
          <Button variant="surface" colorPalette="blue" width="full">
            <Icon as={FaPuzzlePiece} />
            大解谜
          </Button>
        </Link>
        <Link href="https://deepclue.app">
          <Button variant="surface" colorPalette="gray" width="full">
            <Icon as={FaEye} />
            DeepClue
          </Button>
        </Link>
      </SimpleGrid>
    </VStack>
  );
}

function ConnectionLinksSection() {
  const text = `《迷雾档案》是一个推理游戏集合的企划。我们会集合各种形式的推理解谜游戏。
目前我们仍处于开发的早期阶段，各种游戏模式都在更新中，自媒体的内容也在筹备中，欢迎大家关注我们的社交账号！`;

  return (
    <VStack align="start">
      <Box width="full" bg="bg.subtle" padding="10px" borderRadius="md">
        <Text fontSize="sm" whiteSpace="pre-wrap" fontFamily="Noto Serif CJK SC">
          {text}
        </Text>
      </Box>
      <Link href="/download/android/mistcase-android-0.0.1.apk">
        <Button variant="surface" colorPalette="green">
          <Icon as={SiAndroid} />
          《迷雾档案》安卓版 下载
        </Button>
      </Link>
      <Wrap width="full" justify="start" gap={4}>
        <Button
          size={{ md: "sm", base: "xs" }}
          variant="outline"
          onClick={() => window.open('mailto:mistcase@deepclue.app', '_blank', 'noopener,noreferrer')}
        >
          <Icon as={MdEmail} />
          mistcase@deepclue.app
        </Button>
        <Button
          size={{ md: "sm", base: "xs" }}
          variant="outline"
          onClick={() => window.open('https://xhslink.com/m/3keCJl9wtyp', '_blank', 'noopener,noreferrer')}
        >
          <Icon as={SiXiaohongshu} />
          小红书: @deepclue
        </Button>
        <Button
          size={{ md: "sm", base: "xs" }}
          variant="outline"
          onClick={() => window.open('https://space.bilibili.com/3546973590260381', '_blank', 'noopener,noreferrer')}
        >
          <Icon as={SiBilibili} />
          哔哩哔哩: @DeepClue侦探事务所
        </Button>
        <Button
          size={{ md: "sm", base: "xs" }}
          variant="outline"
          onClick={() => window.open('https://qm.qq.com/q/AYvSHdaldC', '_blank', 'noopener,noreferrer')}
        >
          <Icon as={SiTencentqq} />
          QQ: 迷雾档案 MistCase
        </Button>
      </Wrap>
    </VStack>
  );
}

const recent: RecentItem[] = [
  {
    type: "case",
    title: "A05 阿尔卑斯城堡案件",
    cover: "https://egdwsmbwm1nmmqdr.public.blob.vercel-storage.com/cases/a05-cover.jpeg",
    date: "2025-12-09",
    author: "天色盐",
    url: "/detect/case-A05"
  },
  {
    type: "case",
    title: "A06 北海道的粉雪",
    cover: "https://egdwsmbwm1nmmqdr.public.blob.vercel-storage.com/cases/a06-cover.jpeg",
    date: "2025-12-09",
    author: "天色盐",
    url: "/detect/case-A06"
  },
  {
    type: "puzzle",
    title: "命栽七号街",
    cover: "/puzzles/street7.png",
    date: "2025-12-06",
    author: "天色盐",
    url: "https://street7.mistcase.app"
  }
];
