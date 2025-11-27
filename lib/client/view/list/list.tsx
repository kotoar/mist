"use client";

import { Container, Image, For, Heading, HStack, Show, Spacer, VStack, Text, Wrap, Badge, SimpleGrid, Box, Link as ChakraLink, Highlight, Button, Portal, Select, createListCollection } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import Link from "next/link";
import { listViewModel } from "@client/viewmodel/list";
import { CommunityView } from "./community";
import { GuideButtonView } from "./guide";
import { CaseView } from "./case-item";

export function HomeView() {
  const viewModel = useSnapshot(listViewModel);
  
  return (
    <Container maxW="3xl" height="100vh">
      <VStack height="full" align="stretch" paddingTop="20px">
        <BannerView />
        <HStack gap="20px">
          <GuideButtonView />
          <Spacer />
          <Show when={viewModel.type === "case"}>
            <CaseTypeSelector />
          </Show>
        </HStack>
        <SimpleGrid columns={{ base: 2, md: 2 }} gap={4}>
          <Show when={viewModel.type === "case"}>
            <For each={viewModel.showCases}>
              {(item) => (
                <Link key={item.id} href={`/${item.game}/${item.id}`}>
                  <CaseView 
                    type={item.game === "case" ? "case" : "detect"}
                    difficulty={item.difficulty}
                    index={item.index}
                    title={item.title}
                    tags={item.tags}
                    author={item.author}
                  />
                </Link>
              )}
            </For>
          </Show>
          <Show when={viewModel.type === "mist"}>
            <For each={viewModel.mists}>
              {(item) => (
                <Link key={item.id} href={`/mist/${item.id}`}>
                  <CaseView 
                    type="mist"
                    difficulty={item.difficulty}
                    index={item.index}
                    title={item.title}
                    tags={item.tags}
                    author={item.author}
                  />
                </Link>
              )}
            </For>
          </Show>
        </SimpleGrid>
        <CommunityView />
        <VStack align="start" position="sticky" bottom={0} bg="bg" gap="2px">
          <HStack paddingY="10px" width="full" gap="10px">
            <Text fontSize="sm">
              © 2025 MistCase by{" "}
              <ChakraLink colorPalette="cyan" fontSize="sm" asChild>
                <Link href="https://deepclue.app" target="_blank" rel="noopener noreferrer">
                  DeepClue
                </Link>
              </ChakraLink>
            </Text>
            <Spacer />
            <ChakraLink colorPalette="purple" fontSize="sm" asChild>
              <Link href="/aigc">
                AIGC推理实验室
              </Link>
            </ChakraLink>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
}

function BannerView() {
  const viewModel = useSnapshot(listViewModel);

  function TitleView() {
    const viewModel = useSnapshot(listViewModel);

    if (viewModel.type === "case") {
      return (
        <Box>
          <Heading size="2xl">
            <Highlight query="档案" styles={{ px: "0.5", bg: { _light: "teal.200", _dark: "teal.700" } }}>
              迷雾档案
            </Highlight>
          </Heading>
          <Text>侦探们的摸鱼神器</Text>
        </Box>
      );
    } else {
      return (
        <Box>
          <Heading size="2xl">
            <Highlight query="迷雾" styles={{ px: "0.5", bg: { _light: "purple.200", _dark: "purple.700" } }}>
              迷雾档案
            </Highlight>
          </Heading>
          <Text>神明的谜题</Text>
        </Box>
      );
    }
  }

  return (
    <HStack position="sticky" top={0} align="start" zIndex={1} bg="bg" marginBottom="20px">
      <Image src="/icon.png" alt="Logo" boxSize="50px" />
      <TitleView />
      <Spacer />
      <Button 
        size={{ md: "md", base: "sm" }}
        variant={ viewModel.type === "mist" ? "solid" : "outline" }
        colorPalette="purple"
        onClick={() => listViewModel.type = "mist"}
      >迷雾</Button>
      <Button 
        size={{ md: "md", base: "sm" }}
        variant={ viewModel.type === "case" ? "solid" : "outline" } 
        colorPalette="teal"
        onClick={() => listViewModel.type = "case"}
      >档案</Button>
    </HStack>
  );
}

function CaseTypeSelector() {
  const viewModel = useSnapshot(listViewModel);
  const selectorItems = createListCollection({
    items: [
      { label: "全部", value: "all" },
      { label: "演绎", value: "case" },
      { label: "探案", value: "detect" },
    ],
  });
  return (
    <HStack align="center" gap="10px">
      <Text>档案类型</Text>
      <Select.Root 
        collection={selectorItems}
        width="150px"
        size="sm"
        value={[viewModel.caseFilter]}
        onValueChange={(details) => listViewModel.caseFilter = details.value[0] as "all" | "detect" | "case"}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="选择类型" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {selectorItems.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </HStack>
  );
}
