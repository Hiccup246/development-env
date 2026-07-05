import { describe, expect, test } from "bun:test";
import { linesFrom } from "./read.js";

describe("linesFrom", () => {
	test("splits content into trimmed lines", () => {
		expect(linesFrom("one\ntwo\nthree")).toEqual(["one", "two", "three"]);
	});

	test("drops empty lines and whitespace-only lines", () => {
		expect(linesFrom("one\n\n  \ntwo\n")).toEqual(["one", "two"]);
	});

	test("drops comment lines", () => {
		expect(linesFrom("# heading\none\n  # indented comment\ntwo")).toEqual(["one", "two"]);
	});

	test("returns empty array for empty content", () => {
		expect(linesFrom("")).toEqual([]);
	});
});
