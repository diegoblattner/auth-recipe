import { readFileSync } from "node:fs";
export function readFileAsString(path) {
    const content = readFileSync(path).toString();
    return content;
}
export function generateRandomToken(size = 6) {
    return new Array(size).fill(0).map(() => Math.floor(Math.random() * 10)).join("");
}
