import * as p from "@clack/prompts";
import { runLogged, runCapture } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

const STATIC_CONFIG = [
	'git config --global url."git@github.com:".insteadOf https://github.com/',
	"git config --global core.fileMode false",
	"git config --global diff.tool vscode",
	"git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'",
	"git config --global difftool.prompt false",
	'git config --global core.editor "code --wait"',
	"git config --global merge.tool vscode",
	"git config --global mergetool.vscode.cmd 'code --wait $MERGED'",
	"git config --global mergetool.prompt false",
].join(" && ");

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
		await runLogged("Applying git defaults", STATIC_CONFIG);
		await promptConfig("user.email", "Global git email");
		await promptConfig("user.name", "Global git name (Firstname Lastname)");
		await promptConfig("user.displayname", "Global git display name (Firstname Lastname)");
	},
};
