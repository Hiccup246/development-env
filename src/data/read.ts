import { readFileSync } from "node:fs";

/** Reads a data file embedded next to this module (bundles into compiled binaries). */
export function readData(fileName: string): string {
	return readFileSync(new URL(`./${fileName}`, import.meta.url), "utf8");
}

/** Reads a data file and splits it into non-empty, non-comment lines. */
export function readDataLines(fileName: string): string[] {
	return readData(fileName)
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith("#"));
}
