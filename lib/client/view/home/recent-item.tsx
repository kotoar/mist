import { Badge, Card, Heading, HStack, Show, Spacer, VStack, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export interface RecentItem {
  type: "case" | "mist" | "puzzle" | "deepclue";
  title: string;
  cover?: string;
  date: string;
  author?: string;
  url: string;
}

export function RecentItemView(props: RecentItem) {
  const typeText = (() => {
    switch (props.type) {
      case "case":
        return "档案";
      case "mist":
        return "迷雾";
      case "puzzle":
        return "解谜";
      case "deepclue":
        return "深层线索";
    }
  })();

  const typeColor = (() => {
    switch (props.type) {
      case "case":
        return "teal";
      case "mist":
        return "purple";
      case "puzzle":
        return "blue";
      case "deepclue":
        return "pink";
    }
  })();

  const router = useRouter();
  function handleClick() {
    router.push(props.url);
  }
    
  return (
    <Card.Root size="sm" height="100%" onClick={handleClick} cursor="pointer">
      <Show when={props.cover}>
        <Image 
          src={props.cover || undefined} alt="Cover Image" 
          borderTopRadius="md" objectFit="cover" maxH="150px" />
      </Show>
      <Card.Body>
        <VStack align="stretch" gap="4px" height="full" width="full">
          <HStack width="full" align="center" gap="6px" minW="200px" maxW="300px">
            <Badge size={{ md: "sm", base: "xs" }} colorPalette={typeColor}>
              {typeText}
            </Badge>
            <Heading size={{ md: "md", base: "sm" }}>
              {props.title}
            </Heading>
          </HStack>
          <HStack width="full" align="start" gap="6px">
            <Text fontSize={{ md: "sm", base: "xs" }} color="fg.muted">
              {props.date}
            </Text>
            <Show when={props.author}>
              <Spacer />
              <Text fontSize={{ md: "sm", base: "xs" }} color="fg.muted">{props.author}</Text>
            </Show>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
