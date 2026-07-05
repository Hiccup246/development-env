import { readFileSync } from "node:fs";
import macScript from "../data/scripts/mac.sh" with { type: "file" };
import { runScriptLogged } from "../runner.js";
import type { SetupTask } from "./registry.js";

/**
 * Applies macOS system settings useful for development: turns on Safari's
 * developer menu, tweaks Finder display options, unhides the Library folder,
 * and installs Xcode Command Line Tools (needed by lots of dev tools).
 */
export const macTask: SetupTask = {
	id: "mac",
	label: "MacOS defaults",
	hint: "Safari dev menu, Finder, Dock, Xcode CLT",
	async run() {
		await runScriptLogged("Configuring MacOS defaults", readFileSync(macScript, "utf8"));
	},
};
