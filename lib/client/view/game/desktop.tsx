"use client";

import { useSnapshot } from "valtio";
import { Container, For, VStack, Text, SimpleGrid, GridItem, Heading, ScrollArea, Box, HStack, Spacer, Button } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { gameViewModel } from "@client/viewmodel/game";
import { QuestionView } from "./question";
import { StoryBannerView } from "./story-banner";
import { InfoView } from "../info";

export function DesktopGameView() {
	return (
		<Container maxW="container.lg" height="100vh">
			<VStack width="full" height="full" align="stretch" gap="10px" paddingY="20px">
				<SimpleGrid columns={2} gap={4}>
					<GridItem>
						<CaseView />
					</GridItem>
					<GridItem>
						<AnswerView />
					</GridItem>
				</SimpleGrid>
			</VStack>
		</Container>
	);
}

function CaseView() {
	const viewModel = useSnapshot(gameViewModel);
	return (
		<ScrollArea.Root height="95vh" size="sm" variant="always">
			<ScrollArea.Viewport>
				<ScrollArea.Content paddingEnd="5">
					<VStack align="stretch" gap="10px">
						<HStack position="sticky" top={0} zIndex={1} bg="bg">
							<Heading fontSize="2xl" fontWeight="bold">案件</Heading>
							<Spacer />
						</HStack>
						<Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
					</VStack>
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar />
		</ScrollArea.Root>
	);
}

function AnswerView() {
	const viewModel = useSnapshot(gameViewModel);
	const router = useRouter();
	return (
		<ScrollArea.Root height="95vh" size="sm" variant="always">
			<ScrollArea.Viewport>
				<ScrollArea.Content paddingEnd="5">
					<VStack align="stretch" gap="10px" >
						<HStack position="sticky" top={0} zIndex={1} bg="bg">
							<Heading fontSize="2xl" fontWeight="bold">推理</Heading>
							<Spacer />
							<InfoView size="sm" />
							<Button 
								size="sm" colorPalette="red" variant="surface"
								onClick={() => {
									gameViewModel.endGame()
									router.push("/");
								}}
							>结束游戏</Button>
						</HStack>
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
	);
}
