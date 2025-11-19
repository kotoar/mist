export function availableStages(): string[] {
  switch (process.env.NEXT_PUBLIC_BUILD) {
    case "dev":
      return ["prod", "preview"];
    case "preview":
      return ["prod", "preview"];
    default:
      return ["prod"];
  }
}
