"use client";

import { useSnapshot } from "valtio";
import { Container, For, VStack, Text, Spacer, HStack, Button, SimpleGrid, GridItem, Heading, ScrollArea, Show, Card, Box, Switch } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { LoadingView } from "@/lib/components/LoadingView";
import { mistViewModel } from "@client/viewmodel/mist";
import { MistStoryBannerView } from "./story-banner";
import { SectionView } from "./section";
import { MistInfoView } from "../components/info";
import { Prose } from "@/components/ui/prose";
import Markdown from "react-markdown";

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
										<HStack position="sticky" top={0} zIndex={1} bg="bg">
											<Heading fontSize="2xl" fontWeight="bold">{viewModel.title}</Heading>
										</HStack>
										<Prose color="fg">
											<Markdown>
												{viewModel.puzzle}
											</Markdown>
										</Prose>
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
												<Heading fontSize="2xl" fontWeight="bold">迷雾</Heading>
												<Spacer />
												<MistInfoView size="sm" />
												<Button
													size="sm" colorPalette="pink" variant="surface"
													onClick={() => mistViewModel.skip()}
												>我想看答案</Button>
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
			<HStack align="start">
				<Text color="red.500" whiteSpace="nowrap">( {viewModel.count} )</Text>
				<Show when={viewModel.message}>
					<Text color="red.500">{viewModel.message}</Text>
				</Show>
				<Spacer />
				<Switch.Root
					size="sm"
					checked={viewModel.showMistHints}
					onCheckedChange={(e) => mistViewModel.showMistHints = e.checked}
				>
					<Switch.HiddenInput />
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Label whiteSpace="nowrap">显示思路方向</Switch.Label>
				</Switch.Root>
			</HStack>
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
				<Button
					disabled={!viewModel.interactable || viewModel.input.trim() === ''}
					onClick={() => mistViewModel.submit()}
				>
					<Show when={!viewModel.interactable}>
						<LoadingView />
					</Show>
					<Text>提交</Text>
				</Button>
			</HStack>
		</VStack>
	);
}
