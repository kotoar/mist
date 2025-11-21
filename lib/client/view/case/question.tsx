import { VStack, Heading, Show, HStack, Button, Text } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import { IMESafeInput } from "@/lib/components/IMESafeInput";
import { QuestionViewModel } from "@/lib/client/viewmodel/case";

export function QuestionView({ question }: { question: QuestionViewModel }) {
	const viewModel = useSnapshot(question);
	return (
		<VStack align="stretch" gap="6px">
			<Heading fontSize="md">{viewModel.question}</Heading>
			<Show when={viewModel.answer}>
				<Text>{viewModel.answer}</Text>
			</Show>
			<Show when={!viewModel.answer}>
				<Show when={viewModel.wrongFlag}>
					<Text color="red.500">不完全正确。进度：{viewModel.percentage}%</Text>
				</Show>
				<HStack>
					<IMESafeInput
						type="textarea"
						value={viewModel.input}
						onChange={(newValue) => question.updateInput(newValue)}
						textareaProps={{
							onKeyDown: (e) => {
								if (e.key === 'Enter' && !e.shiftKey && viewModel.input.trim() !== '') {
									e.preventDefault();
									question.submit();
								}
							}
						}}
					/>
					<Button disabled={!viewModel.interactable} onClick={() => question.submit()}>提交</Button>
				</HStack>
			</Show>
		</VStack>
	);
}
