import { readFileSync } from "node:fs";
import * as p from "@clack/prompts";
import shellScript from "../data/scripts/shell.sh" with { type: "file" };
import { runScriptInteractive } from "../runner.js";
import type { SetupTask } from "./registry.js";

export const shellTask: SetupTask = {
	id: "shell",
	label: "Shells",
	hint: "homebrew bash + zsh, oh-my-zsh, plugins",
	async run() {
		await runScriptInteractive(readFileSync(shellScript, "utf8"));
		p.log.success("Shell configuration complete");
	},
};
