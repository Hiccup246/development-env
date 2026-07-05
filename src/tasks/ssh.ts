import * as p from "@clack/prompts";
import { runLogged, runInteractive, runCapture, pathExists } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

const SAFE_KEY_NAME = /^[a-zA-Z0-9._-]+$/;

export const sshTask: SetupTask = {
	id: "ssh",
	label: "SSH config",
	hint: "generate config, ssh-add key",
	async run() {
		const keyName = orThrow(
			await p.text({
				message: "Name of your SSH key in ~/.ssh (exclude the .pub extension)",
				validate: (input) => {
					const trimmed = (input ?? "").trim();
					if (trimmed.length === 0) return "Required";
					if (!SAFE_KEY_NAME.test(trimmed)) {
						return "Only letters, numbers, dots, dashes and underscores allowed";
					}
					return undefined;
				},
			}),
		).trim();

		if (!(await pathExists(`$HOME/.ssh/${keyName}`))) {
			throw new Error(
				`~/.ssh/${keyName} not found — generate it first (ssh-keygen, see README step 0)`,
			);
		}

		await runLogged("Ensuring ~/.ssh/config exists", "touch ~/.ssh/config");

		const identityLine = `IdentityFile ~/.ssh/${keyName}`;
		const alreadyConfigured = await runCapture(
			`grep -qxF "\t${identityLine}" ~/.ssh/config && echo yes`,
		);

		if (alreadyConfigured === "yes") {
			p.log.success("github.com already configured in ~/.ssh/config");
		} else {
			const block = ["", "Host github.com", "\tHostName github.com", `\t${identityLine}`, "\tIdentitiesOnly yes", ""].join(
				"\n",
			);
			await runLogged(
				"Adding github.com host to ~/.ssh/config",
				`cat >> ~/.ssh/config <<'EOF'\n${block}\nEOF`,
			);
		}

		await runInteractive(`ssh-add ~/.ssh/${keyName}`);
		p.log.success("SSH configuration complete");
	},
};
