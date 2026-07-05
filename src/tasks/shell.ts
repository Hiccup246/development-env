import * as p from "@clack/prompts";
import { runScriptInteractive } from "../runner.js";
import { readData } from "../data/read.js";
import type { SetupTask } from "./registry.js";

export const shellTask: SetupTask = {
	id: "shell",
	label: "Shells",
	hint: "homebrew bash + zsh, oh-my-zsh, plugins",
	async run() {
		await runScriptInteractive(readData("scripts/shell.sh"));
		p.log.success("Shell configuration complete");
	},
};
