import { Card, VStack, HStack, Spacer, Show, Badge, Heading, Wrap, For, Text, Image, useBreakpointValue } from "@chakra-ui/react";

interface CaseViewProps {
  type: "mist" | "case" | "detect";
  difficulty: "easy" | "medium" | "hard" | undefined;
  index: string;
  title: string;
  tags: readonly string[];
  author?: string;
  cover: string | null;
}
export function CaseView(props: CaseViewProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const difficultyColor = props.difficulty ? (
    props.difficulty === "easy" ? "green" :
      props.difficulty === "medium" ? "yellow" :
        "red"
  ) : undefined;
  const difficultyLabel = props.difficulty ? (
    props.difficulty === "easy" ? "简单" :
      props.difficulty === "medium" ? "中等" :
        "困难"
  ) : undefined;

  if (isMobile) {
    return (
      <Card.Root size="sm" height="full">
        <Show when={props.cover}>
          <Image src={props.cover || undefined} alt="Cover Image" borderTopRadius="md" objectFit="cover" maxH="150px" />
        </Show>
        <Card.Body>
          <VStack align="stretch" gap="4px" height="full" width="full">
            <HStack width="full" align="center">
              <Text>{props.index}</Text>
              <Spacer />
              <Show when={props.difficulty}>
                <Badge size="sm" colorPalette={difficultyColor}>
                  {difficultyLabel}
                </Badge>
              </Show>
            </HStack>
            <Heading size="sm">
              {props.title}
            </Heading>
            <Wrap gap="2px" align="center">
              <For each={props.tags}>
                {(tag) => (
                  <Badge key={tag} colorPalette={tagColor(tag)} size="sm">
                    {tag}
                  </Badge>
                )}
              </For>
              <Show when={props.author}>
                <Spacer />
                <Text color="gray.500" fontSize="xs">{props.author}</Text>
              </Show>
            </Wrap>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  } else {
    return (
      <Card.Root size="sm" height="full">
        <Show when={props.cover}>
          <Image src={props.cover || undefined} alt="Cover Image" borderTopRadius="md" objectFit="cover" maxH="150px" />
        </Show>
        <Card.Body>
          <VStack align="stretch" gap="4px" height="full" width="full">
            <Spacer />
            <HStack width="full" align="start">
              <Text>{props.index}</Text>
              <Heading size={{ md: "md", base: "sm" }}>
                {props.title}
              </Heading>
              <Spacer />
              <Show when={props.difficulty}>
                <Badge size={{ md: "sm", base: "xs" }} colorPalette={difficultyColor}>
                  {difficultyLabel}
                </Badge>
              </Show>
            </HStack>
            <Wrap gap="2px" align="center">
              <For each={props.tags}>
                {(tag) => (
                  <Badge key={tag} colorPalette={tagColor(tag)} size="sm">
                    {tag}
                  </Badge>
                )}
              </For>
              <Show when={props.author}>
                <Spacer />
                <Text color="gray.500" fontSize="sm">{props.author}</Text>
              </Show>
            </Wrap>
          </VStack>
        </Card.Body>
      </Card.Root>
    );
  }
}

type TagColor = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
const colorList: TagColor[] = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'];
function tagColor(tag: string): TagColor {
  const hash = Array.from(tag).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorList[hash % colorList.length];
}
