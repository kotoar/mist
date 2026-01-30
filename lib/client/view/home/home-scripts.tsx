import { Heading, HStack, VStack, Text, Badge } from "@chakra-ui/react";
import Link from "next/link";
import { For } from "@chakra-ui/react";

interface VideoScript {
  series: string;
  title: string;
  url: string;
}

const scripts: VideoScript[] = [
  {
    series: "聚众推理①",
    title: "云端大厦公寓事件",
    url: "/scripts/v01",
  },
];

export function ScriptsSection() {
  return (
    <VStack width="full" align="stretch" gap="5px">
      <For each={scripts}>
        {(item, index) => (
          <ScriptItem key={index} item={item} />
        )}
      </For>
    </VStack>
  );
}

function ScriptItem({ item }: { item: VideoScript }) {
  return (
    <Link href={item.url}>
      <HStack
        align="center"
        width="full"
        gap="10px"
        padding="10px"
        bg="bg.emphasized"
        borderRadius="md"
        _hover={{ bg: "bg.muted" }}
        transition="background 0.2s"
      >
        <Badge colorPalette="purple" variant="solid">
          {item.series}
        </Badge>
        <Text fontWeight="bold">剧本:</Text>
        <Text fontWeight="medium">{item.title}</Text>
      </HStack>
    </Link>
  );
}

