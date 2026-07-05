import { readFileSync } from "node:fs";
import vscodeExtensionsPath from "../data/vscode-extensions.txt" with { type: "file" };
import { runLogged } from "../runner.js";
import { linesFrom } from "../data/read.js";
import type { SetupTask } from "./registry.js";

/**
 * Installs every VSCode extension listed in vscode-extensions.txt, one per
 * line, using the `code` CLI. Requires the `code` command already be on
 * PATH (VSCode: Cmd+Shift+P -> "Shell Command: Install 'code' command").
 */
export const vscodeTask: SetupTask = {
	id: "vscode",
	label: "VSCode extensions",
	hint: "installs extension list",
	async run() {
		const extensions = linesFrom(readFileSync(vscodeExtensionsPath, "utf8"));

		for (const extension of extensions) {
			await runLogged(`Installing ${extension}`, `code --install-extension ${extension}`);
		}
	},
};
