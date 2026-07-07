"use client";

import { GameStateNotice } from "@lib/shared/components/archive/game-state";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <GameStateNotice status="error" onRetry={reset} />;
}
