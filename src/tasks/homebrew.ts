import * as p from "@clack/prompts";
import { runLogged, commandExists } from "../runner.js";
import { orThrow } from "../prompts.js";
import { readDataLines } from "../data/read.js";
import type { SetupTask } from "./registry.js";

export const homebrewTask: SetupTask = {
	id: "homebrew",
	label: "Homebrew",
	hint: "packages + optional casks",
	async run() {
		if (await commandExists("brew")) {
			p.log.success("Homebrew already installed");
		} else {
			await runLogged(
				"Installing Homebrew",
				'/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
			);
			await runLogged("Updating Homebrew", "brew update");
		}

		const packages = readDataLines("homebrew.txt");
		await runLogged("Installing Homebrew packages", `brew install ${packages.join(" ")}`);

		const installCasks = orThrow(
			await p.confirm({
				message: "Install desktop GUI applications using Homebrew casks?",
			}),
		);

		if (installCasks) {
			const casks = readDataLines("homebrew-cask.txt");
			await runLogged(
				"Installing Homebrew casks",
				`brew install --cask --appdir="/Applications" ${casks.join(" ")}`,
			);
		} else {
			p.log.info("Skipping cask installs");
		}
	},
};
