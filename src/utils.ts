import { readFileSync } from "node:fs";

export function readFileAsString(path: string): string {
  const content = readFileSync(path).toString();
  return content;
}
