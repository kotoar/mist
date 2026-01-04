"use client";

import { Container, For, HStack, Show, Spacer, VStack, Text, SimpleGrid, Link as ChakraLink, Portal, Select, createListCollection, Wrap } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import Link from "next/link";
import { listViewModel } from "@client/viewmodel/list";
import { CommunityView } from "./community";
import { GuideButtonView } from "./guide";
import { CaseView } from "./case-item";
import { PageSelector, PageTitleView } from "../components/title";

export function ListView({ type }: { type: "case" | "mist" }) {
  const viewModel = useSnapshot(listViewModel);
  
  return (
    <Container maxW="6xl" height="100vh">
      <VStack height="full" align="stretch" paddingTop="20px">
        <Wrap position="sticky" top={0} align="center" zIndex={1} bg="bg" marginBottom="20px">
          <PageTitleView type={type} />
          <Spacer />
          <PageSelector type={type} />
        </Wrap>
        <HStack gap="20px">
          <GuideButtonView />
          <Spacer />
          <Show when={type === "case"}>
            <CaseTypeSelector />
          </Show>
        </HStack>
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} gap={4}>
          <Show when={type === "case"}>
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
                    cover={item.cover}
                  />
                </Link>
              )}
            </For>
          </Show>
          <Show when={type === "mist"}>
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
                    cover={null}
                  />
                </Link>
              )}
            </For>
          </Show>
        </SimpleGrid>
        <Spacer />
        <CommunityView />
        <HStack paddingY="10px" width="full" gap="10px">
          <Text fontSize="sm">
            © 2025 MistCase by{" "}
            <ChakraLink colorPalette="cyan" fontSize="sm" asChild>
              <Link href="https://deepclue.app" target="_blank" rel="noopener noreferrer">
                DeepClue
              </Link>
            </ChakraLink>
          </Text>
        </HStack>
      </VStack>
    </Container>
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
      <Text fontSize="sm">档案类型</Text>
      <Select.Root 
        collection={selectorItems}
        width="100px"
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
