import { readFileSync } from "node:fs";
import shellScript from "../data/scripts/shell.sh" with { type: "file" };
import { runScriptLogged } from "../runner.js";
import type { SetupTask } from "./registry.js";

export const shellTask: SetupTask = {
	id: "shell",
	label: "Shells",
	hint: "oh-my-zsh, plugins, default shell",
	async run() {
		await runScriptLogged("Configuring shell", readFileSync(shellScript, "utf8"));
	},
};
