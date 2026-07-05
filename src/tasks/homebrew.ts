import { readFileSync } from "node:fs";
import * as clackPrompt from "@clack/prompts";
import installHomebrewScript from "../data/scripts/install-homebrew.sh" with { type: "file" };
import homebrewPackagesPath from "../data/homebrew.txt" with { type: "file" };
import homebrewCasksPath from "../data/homebrew-cask.txt" with { type: "file" };
import { runLogged, runScriptInteractive } from "../runner.js";
import { orThrow } from "../prompts.js";
import { linesFrom } from "../data/read.js";
import type { SetupTask } from "./registry.js";

export const homebrewTask: SetupTask = {
	id: "homebrew",
	label: "Homebrew",
	hint: "packages + optional casks",
	async run() {
		// Interactive: Homebrew's own installer prompts for a sudo password on a
		// completely fresh machine where /opt/homebrew doesn't exist yet.
		await runScriptInteractive(readFileSync(installHomebrewScript, "utf8"));

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
