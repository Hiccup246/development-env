/** Splits file content into non-empty, non-comment lines. */
export function linesFrom(content: string): string[] {
	return content
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0 && !line.startsWith("#"));
}
