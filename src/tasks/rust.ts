import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const rustTask: SetupTask = {
	id: "rust",
	label: "Rust",
	hint: "rustup",
	run() {
		p.log.warn("rust task not yet implemented");
		return Promise.resolve();
	},
};
