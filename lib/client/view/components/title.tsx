import { Box, Heading, HStack, Button, Highlight, Text, Image, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { useSnapshot } from "valtio";
import { listViewModel } from "@client/viewmodel/list";

export function PageTitleView({ type }: { type: "case" | "mist" | "aigc" | "puzzles" }) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isMobile) {
    return (
      <HStack>
        <Image src="/icon.png" alt="Logo" boxSize="20px" />
        <Heading size="lg">
          迷雾档案
        </Heading>
      </HStack>
    );
  }

  switch (type) {
    case "case":
      return (
        <HStack>
          <Image src="/icon.png" alt="Logo" boxSize="50px" />
          <Box width="200px">
            <Heading size="2xl">
              <Highlight query="档案" styles={{ px: "0.5", bg: { _light: "teal.200", _dark: "teal.700" } }}>
                迷雾档案
              </Highlight>
            </Heading>
            <Text>侦探们的摸鱼神器</Text>
          </Box>
        </HStack>
      );
    case "mist":
      return (
        <HStack>
          <Image src="/icon.png" alt="Logo" boxSize="50px" />
          <Box width="200px">
            <Heading size="2xl">
              <Highlight query="迷雾" styles={{ px: "0.5", bg: { _light: "purple.200", _dark: "purple.700" } }}>
                迷雾档案
              </Highlight>
            </Heading>
            <Text>神明的谜题</Text>
          </Box>
        </HStack>
      );
    case "aigc":
      return (
        <HStack position="sticky" top="0" align="center" width="full" gap="10px" bg="bg" zIndex={1} py="10px">
          <Image src="/lab-icon.png" alt="Logo:Lab" boxSize="50px" />
          <Heading size="2xl">迷雾档案：AIGC 推理实验室</Heading>
        </HStack>
      );
    case "puzzles":
      return (
        <HStack position="sticky" top="0" align="center" width="full" gap="10px" bg="bg" zIndex={1} py="10px">
          <Image src="/icon.png" alt="Logo:Puzzles" boxSize="50px" />
          <Heading size="2xl">迷雾档案：网页解密游戏</Heading>
        </HStack>
      );
    default:
      return null;
  }
}

export function PageSelector() {
  const viewModel = useSnapshot(listViewModel);
  return (
    <HStack gap="4px">
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ viewModel.type === "case" ? "surface" : "ghost" } 
        colorPalette="teal"
        onClick={() => listViewModel.type = "case"}
      >档案</Button>
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ viewModel.type === "mist" ? "surface" : "ghost" }
        colorPalette="purple"
        onClick={() => listViewModel.type = "mist"}
      >迷雾</Button>
      <Link href="/puzzles" passHref>
        <Button 
          size={{ md: "sm", base: "xs" }}
          variant="ghost"
        >解密</Button>
      </Link>
      <Link href="/aigc" passHref>
        <Button 
          size={{ md: "sm", base: "xs" }}
          variant="ghost"
        >实验室</Button>
      </Link>
    </HStack>
  );
}
