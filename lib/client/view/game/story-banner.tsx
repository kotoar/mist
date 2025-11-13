import { useSnapshot } from "valtio";
import { useRouter } from "next/navigation";
import { gameViewModel } from "@client/viewmodel/game";
import { Alert, Button, Dialog, Portal, Spacer, Text } from "@chakra-ui/react";

export function StoryBannerView() {
  const viewModel = useSnapshot(gameViewModel);
  const router = useRouter();

  if (!viewModel.story) { return undefined; }

  return (
    <Alert.Root status="success">
      <Alert.Indicator />
      <Alert.Title>恭喜完成故事！</Alert.Title>
      <Spacer />
      <Dialog.Root size="lg">
        <Dialog.Trigger asChild>
          <Button variant="outline">阅读结局故事</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>结局故事</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text whiteSpace="pre-wrap">{viewModel.story}</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={() => {
                  gameViewModel.endGame();
                  router.push("/");
                }}>结束游戏</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Alert.Root>
  )
}
