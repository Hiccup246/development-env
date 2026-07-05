import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const dotfilesTask: SetupTask = {
	id: "dotfiles",
	label: "Dotfiles",
	hint: "stow ~/dotfiles -> home symlinks",
	run() {
		p.log.warn("dotfiles task not yet implemented");
		return Promise.resolve();
	},
};
