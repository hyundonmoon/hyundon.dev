export const tagColors: Record<string, { border: string; text: string }> = {
  dev: { border: "border-terminal-green", text: "text-terminal-green" },
  travel: { border: "border-terminal-amber", text: "text-terminal-amber" },
  life: { border: "border-terminal-purple", text: "text-terminal-purple" },
};

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
