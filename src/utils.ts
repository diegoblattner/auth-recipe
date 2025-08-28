import { readFileSync } from "node:fs";

export function readFileAsString(path: string): string {
  const content = readFileSync(path).toString();
  return content;
}

export function generateRandomToken(size: number = 6): string {
  const output = new Array(size);
  while (size > 0) {
    output[size - 1] = Math.floor(Math.random() * 10);
    size--;
  }
  return output.join("");
}
