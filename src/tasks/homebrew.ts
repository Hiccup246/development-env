import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const homebrewTask: SetupTask = {
	id: "homebrew",
	label: "Homebrew",
	hint: "packages + optional casks",
	run() {
		p.log.warn("homebrew task not yet implemented");
		return Promise.resolve();
	},
};
