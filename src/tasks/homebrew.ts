import { existsSync, readFileSync } from "node:fs";
import * as clackPrompt from "@clack/prompts";
import installHomebrewScript from "../data/scripts/install-homebrew.sh" with { type: "file" };
import homebrewPackagesPath from "../data/homebrew.txt" with { type: "file" };
import homebrewCasksPath from "../data/homebrew-cask.txt" with { type: "file" };
import { runLogged, runScriptInteractive } from "../runner.js";
import { orThrow } from "../prompts.js";
import { linesFrom } from "../data/read.js";
import type { SetupTask } from "./registry.js";

/**
 * On a fresh machine brew isn't on PATH until the stowed .zshrc lands (a later
 * task), so make it visible to every command this process spawns from here on.
 */
function ensureBrewOnPath(): void {
	const path = process.env.PATH ?? "";
	const dirs = path.split(":");
	for (const dir of ["/opt/homebrew/bin", "/usr/local/bin"]) {
		if (existsSync(`${dir}/brew`) && !dirs.includes(dir)) {
			process.env.PATH = `${dir}:${path}`;
			return;
		}
	}
}

/**
 * Installs Homebrew itself (Mac's package manager) if it's not there yet,
 * then installs everything listed in homebrew.txt (CLI tools). Casks (Mac
 * desktop apps, e.g. Chrome, iTerm) are optional and only installed if you
 * say yes to the prompt — they're listed separately in homebrew-cask.txt.
 */
export const homebrewTask: SetupTask = {
	id: "homebrew",
	label: "Homebrew",
	hint: "packages + optional casks",
	async run() {
		// Interactive: Homebrew's own installer prompts for a sudo password on a
		// completely fresh machine where /opt/homebrew doesn't exist yet.
		await runScriptInteractive(readFileSync(installHomebrewScript, "utf8"));
		ensureBrewOnPath();

		const packages = linesFrom(readFileSync(homebrewPackagesPath, "utf8"));
		await runLogged("Installing Homebrew packages", `brew install ${packages.join(" ")}`);

		const installCasks = orThrow(
			await clackPrompt.confirm({
				message: "Install desktop GUI applications using Homebrew casks?",
			}),
		);

		if (installCasks) {
			const casks = linesFrom(readFileSync(homebrewCasksPath, "utf8"));
			await runLogged(
				"Installing Homebrew casks",
				`brew install --cask --appdir="/Applications" ${casks.join(" ")}`,
			);
		} else {
			clackPrompt.log.info("Skipping cask installs");
		}
	},
};
