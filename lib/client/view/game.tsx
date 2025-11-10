"use client";

import { Container, For, VStack, Text, Spacer, HStack, Button, SimpleGrid, GridItem, Heading } from "@chakra-ui/react"
import { useSnapshot } from "valtio";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { gameViewModel } from "@/lib/client/viewmodel/game";

export function GameView() {
	const viewModel = useSnapshot(gameViewModel);

	return (
		<Container maxW="container.lg" height="100vh">
			<VStack width="full" height="full" align="stretch" gap="10px" paddingY="20px">
				<SimpleGrid columns={2} gap={4}>
					<GridItem>
						<Heading fontSize="2xl" fontWeight="bold">谜面</Heading>
						<Text whiteSpace="pre-wrap">{viewModel.puzzle}</Text>
					</GridItem>
					<GridItem>
						<VStack width="full" gap="10px" align="stretch">
							<Heading fontSize="2xl" fontWeight="bold">迷雾</Heading>
							<For each={viewModel.clues}>
								{(clue, index) => (
									<Text key={index}>
										[{index + 1}] {clue ?? "**********"}
									</Text>
								)}
							</For>
						</VStack>
					</GridItem>
				</SimpleGrid>
				<Spacer />
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
					<Button onClick={() => gameViewModel.submit()}>Submit</Button>
				</HStack>
			</VStack>
		</Container>
	);
}
