import { readFileSync } from "node:fs";
import vscodeExtensionsPath from "../data/vscode-extensions.txt" with { type: "file" };
import { runLogged } from "../runner.js";
import { linesFrom } from "../data/read.js";
import type { SetupTask } from "./registry.js";

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
