import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const shellTask: SetupTask = {
	id: "shell",
	label: "Shells",
	hint: "homebrew bash + zsh, oh-my-zsh, plugins",
	run() {
		p.log.warn("shell task not yet implemented");
		return Promise.resolve();
	},
};
