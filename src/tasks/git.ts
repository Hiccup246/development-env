import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const gitTask: SetupTask = {
	id: "git",
	label: "Git config",
	hint: "email, name, editor, difftool",
	run() {
		p.log.warn("git task not yet implemented");
		return Promise.resolve();
	},
};
