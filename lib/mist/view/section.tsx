"use client";

import { Box, VStack, chakra } from "@chakra-ui/react";
import { useSnapshot } from "valtio";
import { SectionRepresent, mistViewModel, ClueRepresent, sectionCompleted } from "@lib/mist/viewmodel";

/** 一节迷雾: 边框盒 + 标题 + 线索槽(已解铜线, 未解细线占位)。 */
export function SectionView({ section }: { section: SectionRepresent }) {
  const viewModel = useSnapshot(mistViewModel);
  const completed = sectionCompleted(section);

  return (
    <Box border="1px solid" borderColor="arch.rule" px="16px" py="14px">
      {section.title ? (
        <chakra.div
          display="flex"
          alignItems="center"
          gap="8px"
          fontFamily="serif"
          fontWeight="700"
          fontSize="14.5px"
          letterSpacing="1px"
          color="arch.ink"
          pb="9px"
          mb="4px"
          borderBottom="1px solid"
          borderColor="arch.ruleSoft"
        >
          {completed ? (
            <chakra.span color="arch.mist" fontFamily="mono" fontSize="13px">
              ✓
            </chakra.span>
          ) : null}
          {section.title}
        </chakra.div>
      ) : null}
      <VStack align="stretch" gap="10px" mt={section.title ? "10px" : "0"}>
        {section.clues.map((clue, index) => (
          <ClueSlot key={index} clue={clue} indicated={viewModel.indicatedId.includes(clue.id)} showHints={viewModel.showMistHints} />
        ))}
      </VStack>
    </Box>
  );
}

function ClueSlot({ clue, indicated, showHints }: { clue: ClueRepresent; indicated: boolean; showHints: boolean }) {
  if (clue.content) {
    return (
      <Box px="12px" py="9px" borderLeft="2px solid" borderColor="arch.brass">
        <chakra.div
          fontFamily="serif"
          fontSize="13.5px"
          lineHeight="1.85"
          whiteSpace="pre-wrap"
          color={indicated ? "arch.red" : "arch.dim"}
        >
          {clue.content}
        </chakra.div>
      </Box>
    );
  }
  return (
    <Box px="12px" py="9px" borderLeft="2px solid" borderColor="arch.rule" bg="arch.ruleSoft" minH="36px">
      <chakra.span fontFamily="mono" fontSize="12px" letterSpacing="1px" color="arch.mut" ml="10%" visibility={clue.hint && showHints ? "visible" : "hidden"}>
        [{clue.hint ?? " "}]
      </chakra.span>
    </Box>
  );
}
