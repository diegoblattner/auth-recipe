import { readFileSync } from "node:fs";
export function readFileAsString(path) {
    const content = readFileSync(path).toString();
    return content;
}
