import { readFileSync } from "node:fs";

export function readFileAsString(path: string): string {
  const content = readFileSync(path).toString();
  return content;
}

export function generateRandomToken(size: number = 6): string {
  return new Array(size).fill(0).map(() => Math.floor(Math.random() * 10)).join("");
}
