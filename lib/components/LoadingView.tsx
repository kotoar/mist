import { ProgressCircle } from "@chakra-ui/react";

export function LoadingView() {
  return (
    <ProgressCircle.Root value={null} size="xs">
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range />
      </ProgressCircle.Circle>
    </ProgressCircle.Root>
  );
}