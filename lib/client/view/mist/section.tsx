import { Box, VStack, HStack, Show, Icon, For, Text } from "@chakra-ui/react";
import { CiCircleCheck } from "react-icons/ci";
import { useSnapshot } from "valtio";
import { SectionRepresent, mistViewModel, ClueRepresent, sectionCompleted } from "@client/viewmodel/mist";

export function SectionView({section}: {section: SectionRepresent}) {
	const viewModel = useSnapshot(mistViewModel);

	function ClueView({clue}: {clue: ClueRepresent}) {
		if (clue.content) {
			return (
				<Text 
					whiteSpace="pre-wrap" 
					color={viewModel.indicatedId.includes(clue.id) ? "red.500" : "fg.default"}
				>{clue.content}</Text>
			);
		}
		return (
			<Box bg="bg.emphasized" width="full">
				<Text whiteSpace="pre-wrap" color="fg.subtle" marginLeft="10%">
					{clue.hint && viewModel.showMistHints ? `[${clue.hint}]` : " "}
				</Text>
			</Box>
		);
	}

	return (
		<VStack align="stretch" gap="6px">
      <HStack justify="start">
        <Show when={sectionCompleted(section)}>
          <Icon size="lg" as={CiCircleCheck} color="green.500" />
        </Show>
        <Show when={section.title}>
          <Text fontWeight="bold">{section.title}</Text>
        </Show>
      </HStack>
      <For each={section.clues}>
        {(clue, index) => (
          <ClueView key={index} clue={clue} />
        )}
      </For>
    </VStack>
	)
}
