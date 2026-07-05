import * as p from "@clack/prompts";
import { runLogged, runCapture, runScriptLogged } from "../runner.js";
import { orThrow } from "../prompts.js";
import { readData } from "../data/read.js";
import type { SetupTask } from "./registry.js";

async function promptConfig(key: string, message: string): Promise<void> {
	const current = await runCapture(`git config --global ${key}`);
	const value = orThrow(
		await p.text({
			message,
			initialValue: current ?? "",
			validate: (input) => ((input ?? "").trim().length === 0 ? "Required" : undefined),
		}),
	);
	await runLogged(`Setting git ${key}`, `git config --global ${key} "${value}"`);
}

export const gitTask: SetupTask = {
	id: "git",
	label: "Git config",
	hint: "email, name, editor, difftool",
	async run() {
		await runScriptLogged("Applying git defaults", readData("scripts/git-defaults.sh"));
		await promptConfig("user.email", "Global git email");
		await promptConfig("user.name", "Global git name (Firstname Lastname)");
		await promptConfig("user.displayname", "Global git display name (Firstname Lastname)");
	},
};
