export function ogText(value: string | undefined, fallback: string) {
  const safe = (value ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
  return safe || fallback;
}
