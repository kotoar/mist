import { Heading, HStack, Button, Image, Wrap, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PageType } from "@client/viewmodel/list";

export function PageTitleView({ type }: { type?: PageType }) {
  switch (type) {
    case "case":
    case "mist":
    case "home":
    case "puzzles":
      return (
        <HStack gap="10px">
          <Image src="/icon.png" alt="Logo:Puzzles" boxSize="30px" />
          <Heading size="2xl">迷雾档案</Heading>
        </HStack>
      );
    case "lab":
      return (
        <HStack gap="10px">
          <Image src="/lab-icon.png" alt="Logo:Lab" boxSize="30px" />
          <Heading size="2xl">迷雾档案：实验室</Heading>
        </HStack>
      );
    default:
      return null;
  }
}

export function PageSelector({ type }: { type?: PageType }) {
  const router = useRouter();

  return (
    <HStack gap="4px">
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ type === "home" ? "surface" : "ghost" } 
        colorPalette="orange"
        onClick={ () => router.push("/")}
      >主页</Button>
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ type === "case" ? "surface" : "ghost" } 
        colorPalette="teal"
        onClick={() => router.push("/case")}
      >档案</Button>
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ type === "mist" ? "surface" : "ghost" }
        colorPalette="purple"
        onClick={() => router.push("/mist")}
      >迷雾</Button>
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ type === "puzzles" ? "surface" : "ghost" }
        colorPalette="blue"
        onClick={() => router.push("/puzzles")}
      >解谜</Button>
      <Button 
        size={{ md: "sm", base: "xs" }}
        variant={ type === "lab" ? "surface" : "ghost" }
        colorPalette="blue"
        onClick={() => router.push("/lab")}
      >实验室</Button>
    </HStack>
  );
}

export function PageNavigator({ type }: { type?: PageType }) {
  return (
    <Wrap position="sticky" top={0} align="center" zIndex={1} bg="bg" marginBottom="20px">
      <PageTitleView type={type} />
      <Spacer />
      <PageSelector type={type} />
    </Wrap>
  );
}
