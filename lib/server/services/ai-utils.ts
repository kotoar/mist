export function repairText(text: string): string {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    const output = text.substring(firstBrace, lastBrace + 1);
    return output;
  }
  const output = text
    .replace(/\*\*/g, '')
    .replace(/[\n\r]+/g, " ").trim();
  return output;
}