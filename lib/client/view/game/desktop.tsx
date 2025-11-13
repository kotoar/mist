"use client";

import { useSnapshot } from "valtio";
import { Container, For, VStack, Text, SimpleGrid, GridItem, Heading, ScrollArea, Box } from "@chakra-ui/react"
import { gameViewModel } from "@client/viewmodel/game";
import { QuestionView } from "./question";
import { StoryBannerView } from "./story-banner";

export function DesktopGameView() {
	const viewModel = useSnapshot(gameViewModel);

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
										<Box position="sticky" top={0} zIndex={1} bg="bg">
											<Heading fontSize="2xl" fontWeight="bold">推理</Heading>
										</Box>
										<For each={viewModel.questions}>
											{(_, index) => (
												<QuestionView key={index} question={gameViewModel.questions[index]} />
											)}
										</For>
										<StoryBannerView />
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
