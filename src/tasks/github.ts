import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const githubTask: SetupTask = {
	id: "github",
	label: "GitHub repo cloning",
	hint: "clone all public repos from a user",
	run() {
		p.log.warn("github task not yet implemented");
		return Promise.resolve();
	},
};
