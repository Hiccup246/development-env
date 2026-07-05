import * as clackPrompt from "@clack/prompts";
import { runInteractive, runLogged, runCapture, commandExists } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

async function isLoggedIn(): Promise<boolean> {
	const statusJson = await runCapture("claude auth status --json");
	if (!statusJson) return false;

	try {
		const status = JSON.parse(statusJson) as { loggedIn?: boolean };
		return status.loggedIn === true;
	} catch {
		return false;
	}
}

/**
 * Sets up AI dev tooling: installs the Claude Code CLI if it's missing, logs
 * you in (optional), installs the "caveman" Claude Code plugin, and checks
 * that rtk (installed earlier by the Homebrew task) is working.
 */
export const aiTask: SetupTask = {
	id: "ai",
	label: "AI tooling",
	hint: "Claude Code, caveman plugin, rtk",
	async run() {
		if (await commandExists("claude")) {
			clackPrompt.log.success("Claude Code already installed");
		} else {
			await runLogged("Installing Claude Code", "curl -fsSL https://claude.ai/install.sh | bash");
		}

		if (await isLoggedIn()) {
			clackPrompt.log.success("Already logged in to Claude Code");
		} else {
			const login = orThrow(
				await clackPrompt.confirm({ message: "Log in to Claude Code now?", initialValue: true }),
			);
			if (login) {
				await runInteractive("claude auth login");
			} else {
				clackPrompt.log.info("Skipping login — run 'claude auth login' later");
			}
		}

		await runLogged(
			"Adding caveman plugin marketplace",
			"claude plugin marketplace add JuliusBrussee/caveman",
		);
		await runLogged("Installing caveman plugin", "claude plugin install caveman@caveman");

		if (await commandExists("rtk")) {
			await runLogged("Verifying rtk", "rtk --version && rtk gain");
		} else {
			clackPrompt.log.warn("rtk not found on PATH — run the Homebrew task first");
		}
	},
};
