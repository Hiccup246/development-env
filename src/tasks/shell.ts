import { readFileSync } from "node:fs";
import shellScript from "../data/scripts/shell.sh" with { type: "file" };
import { runScriptLogged } from "../runner.js";
import type { SetupTask } from "./registry.js";

/**
 * Sets up the shell: installs oh-my-zsh (a zsh config framework) and a few
 * useful plugins (autosuggestions, syntax highlighting, completions), then
 * makes zsh the default shell. See shell.sh for the exact steps.
 */
export const shellTask: SetupTask = {
	id: "shell",
	label: "Shells",
	hint: "oh-my-zsh, plugins, default shell",
	async run() {
		await runScriptLogged("Configuring shell", readFileSync(shellScript, "utf8"));
	},
};
