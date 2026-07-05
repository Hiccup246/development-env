import { runLogged } from "../runner.js";
import { readDataLines } from "../data/read.js";
import type { SetupTask } from "./registry.js";

export const vscodeTask: SetupTask = {
	id: "vscode",
	label: "VSCode extensions",
	hint: "installs extension list",
	async run() {
		const extensions = readDataLines("vscode-extensions.txt");

		for (const extension of extensions) {
			await runLogged(`Installing ${extension}`, `code --install-extension ${extension}`);
		}
	},
};
