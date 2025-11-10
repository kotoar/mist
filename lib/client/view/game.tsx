"use client";

import { Container, For, VStack, Text, Spacer, HStack, Button, SimpleGrid, GridItem, Heading, ScrollArea, Show } from "@chakra-ui/react"
import { useSnapshot } from "valtio";
import { useRouter } from "next/navigation";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { ClueRepresent } from "@shared/interfaces";
import { gameViewModel } from "@client/viewmodel/game";

export function GameView() {
	const viewModel = useSnapshot(gameViewModel);
	const router = useRouter();

	function represent(clue: ClueRepresent) {
		if (clue.clue) {
			return clue.clue;
		}
		if (clue.hint) {
			return `********* (${clue.hint})`;
		}
		return `*********`;
	}

	return (
		<Container maxW="container.lg" height="100vh">
			<VStack width="full" height="full" align="stretch" gap="10px" paddingY="20px">
				<SimpleGrid columns={2} gap={4}>
					<GridItem>
						<VStack height="full" gap="15px" align="stretch">
							<Heading fontSize="2xl" fontWeight="bold">谜面</Heading>
							<ScrollArea.Root height="80vh" size="sm" variant="always">
								<ScrollArea.Viewport>
									<ScrollArea.Content paddingEnd="5">
										<Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
									</ScrollArea.Content>
								</ScrollArea.Viewport>
								<ScrollArea.Scrollbar />
							</ScrollArea.Root>
						</VStack>
					</GridItem>
					<GridItem>
						<VStack width="full" gap="4px" align="stretch">
							<Heading fontSize="2xl" fontWeight="bold">推理</Heading>
							<For each={viewModel.clues}>
								{(clue, index) => (
									<Text key={index} color={viewModel.indicatedId.includes(clue.id) ? "fg.error" : "fg.default"} whiteSpace="pre-wrap">
										[{index + 1}] {represent(clue)}
									</Text>
								)}
							</For>
							<Spacer />
							<Show when={viewModel.showInvalid}>
								<Text color="red.500">没有新的线索显现</Text>
							</Show>
							<HStack>
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
								<Button onClick={() => {
									gameViewModel.endGame();
									router.push('/');
								}}>
									结束游戏
								</Button>
							</HStack>
						</VStack>
					</GridItem>
				</SimpleGrid>
			</VStack>
		</Container>
	);
}
