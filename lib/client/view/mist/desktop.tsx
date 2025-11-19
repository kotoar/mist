"use client";

import { useSnapshot } from "valtio";
import { Container, For, VStack, Text, Spacer, HStack, Button, SimpleGrid, GridItem, Heading, ScrollArea, Show, Card, Box } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { mistViewModel } from "@client/viewmodel/mist";
import { MistStoryBannerView } from "./story-banner";
import { SectionView } from "./section";

export function DesktopMistView() {
	const viewModel = useSnapshot(mistViewModel);
  const router = useRouter();

	return (
		<Container maxW="container.lg" height="100vh">
			<VStack width="full" height="full" align="stretch" gap="10px" paddingY="20px">
				<SimpleGrid columns={2} gap={4}>
					<GridItem>
						<ScrollArea.Root height="95vh" size="sm" variant="always">
							<ScrollArea.Viewport>
								<ScrollArea.Content paddingEnd="5">
									<VStack align="stretch" gap="10px" padding="15px">
										<Box position="sticky" top={0} zIndex={1} bg="bg">
											<Heading fontSize="2xl" fontWeight="bold">谜题</Heading>
										</Box>
										<Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
									</VStack>
								</ScrollArea.Content>
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar />
						</ScrollArea.Root>
					</GridItem>
					<GridItem>
						<ScrollArea.Root height="95vh" size="sm" variant="always">
							<ScrollArea.Viewport>
								<ScrollArea.Content paddingEnd="5">
									<VStack gap="10px" align="stretch">
                    <VStack position="sticky" top={0} paddingY="4px" zIndex={1} bg="bg">
                      <HStack width="full">
                        <Heading fontSize="2xl" fontWeight="bold">推理</Heading>
                        <Spacer />
												<Button 
                          size="sm" colorPalette="pink" variant="surface"
                          onClick={() => mistViewModel.skip()}
                        >直接看答案</Button>
                        <Button 
                          size="sm" colorPalette="red" variant="surface"
                          onClick={() => {
                            mistViewModel.endGame()
                            router.push("/");
                          }}
                        >结束游戏</Button>
                      </HStack>
                      <Show when={viewModel.story}>
                        <MistStoryBannerView />
                      </Show>
                    </VStack>
										<For each={viewModel.sections}>
											{(section, index) => (
                        <Card.Root key={index}>
                          <Card.Body>
                            <SectionView key={index} section={section} />
                          </Card.Body>
                        </Card.Root>
											)}
										</For>
										<Spacer />
										<Box position="sticky" bottom={0} bg="bg" paddingY="10px" zIndex={1}>
											<PanelView />
										</Box>
									</VStack>
								</ScrollArea.Content>
							</ScrollArea.Viewport>
							<ScrollArea.Scrollbar />
						</ScrollArea.Root>
					</GridItem>
				</SimpleGrid>
			</VStack>
		</Container>
	);
}

function PanelView() {
	const viewModel = useSnapshot(mistViewModel);
	return (
		<VStack width="full" align="stretch" gap="10px">
			<Show when={viewModel.showInvalid}>
				<Text color="red.500">没有新的线索显现</Text>
			</Show>
			<HStack align="start">
				<IMESafeInput
					type="textarea"
					value={viewModel.input}
					onChange={(newValue) => (mistViewModel.input = newValue)}
					textareaProps={{
						onKeyDown: (e) => {
							if (e.key === 'Enter' && !e.shiftKey && viewModel.input.trim() !== '') {
								e.preventDefault();
								mistViewModel.submit();
							}
						}
					}}
				/>
				<Button onClick={() => mistViewModel.submit()}>提交</Button>
			</HStack>
		</VStack>
	);
}
