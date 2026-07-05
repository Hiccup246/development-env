import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const aiTask: SetupTask = {
	id: "ai",
	label: "AI tooling",
	hint: "Claude Code, caveman plugin, rtk",
	run() {
		p.log.warn("ai task not yet implemented");
		return Promise.resolve();
	},
};
