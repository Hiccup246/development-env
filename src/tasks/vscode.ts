import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const vscodeTask: SetupTask = {
	id: "vscode",
	label: "VSCode extensions",
	hint: "installs extension list",
	run() {
		p.log.warn("vscode task not yet implemented");
		return Promise.resolve();
	},
};
