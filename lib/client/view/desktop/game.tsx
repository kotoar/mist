"use client";

import { useSnapshot } from "valtio";
import { Container, For, VStack, Text, Spacer, HStack, Button, SimpleGrid, GridItem, Heading, ScrollArea, Show, Card, Box, Icon } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import { CiCircleCheck } from "react-icons/ci";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { ClueRepresent } from "@shared/interfaces";
import { gameViewModel, SectionContent } from "@client/viewmodel/game";

export function GameView() {
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
										<For each={viewModel.sections}>
											{(section, index) => (
												<SectionView key={index} section={section} />
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

function SectionView({section}: {section: SectionContent}) {
	const viewModel = useSnapshot(gameViewModel);

	function ClueView({clue}: {clue: ClueRepresent}) {
		if (clue.clue) {
			return (
				<Text 
					whiteSpace="pre-wrap" 
					color={viewModel.indicatedId.includes(clue.id) ? "red.500" : "fg.default"}
				>{clue.clue}</Text>
			);
		}
		return (
			<Box bg="bg.emphasized" width="full">
				<Text whiteSpace="pre-wrap" color="fg.subtle" marginLeft="10%">
					{clue.hint ? `[${clue.hint}]` : " "}
				</Text>
			</Box>
		);
	}

	return (
		<Card.Root>
			<Card.Body>
				<VStack align="stretch" gap="6px">
					<HStack justify="start">
						<Show when={section.completed}>
							<Icon size="lg" as={CiCircleCheck} color="green.500" />
						</Show>
						<Show when={section.title}>
							<Text fontWeight="bold">{section.title}</Text>
						</Show>
					</HStack>
					<For each={section.items}>
						{(clue, index) => (
							<ClueView key={index} clue={clue} />
						)}
					</For>
				</VStack>
			</Card.Body>
		</Card.Root>
	)
}

function PanelView() {
	const viewModel = useSnapshot(gameViewModel);
	const router = useRouter();
	return (
		<VStack width="full" align="stretch" gap="10px">
			<Show when={viewModel.showInvalid}>
				<Text color="red.500">没有新的线索显现</Text>
			</Show>
			<HStack align="start">
				<IMESafeInput
					type="textarea"
					value={viewModel.input}
					onChange={(newValue) => (gameViewModel.input = newValue)}
					textareaProps={{
						onKeyDown: (e) => {
							if (e.key === 'Enter' && !e.shiftKey && viewModel.input.trim() !== '') {
								e.preventDefault();
								gameViewModel.submit();
							}
						}
					}}
				/>
				<Button onClick={() => gameViewModel.submit()}>提交</Button>
				<Button 
					onClick={() => {
						gameViewModel.endGame();
						router.push('/');
					}}
				>结束游戏</Button>
			</HStack>
		</VStack>
	);
}
