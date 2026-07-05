import * as clackPrompt from "@clack/prompts";
import { runInteractive } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

/**
 * Optionally installs Rust. Asks for confirmation first (some people don't
 * want it), then runs rustup-init, the official Rust installer, interactively.
 */
export const rustTask: SetupTask = {
	id: "rust",
	label: "Rust",
	hint: "rustup",
	async run() {
		const install = orThrow(await clackPrompt.confirm({ message: "Install Rust using rustup?" }));

		if (!install) {
			clackPrompt.log.info("Skipping Rust install");
			return;
		}

		await runInteractive("rustup-init");
	},
};
