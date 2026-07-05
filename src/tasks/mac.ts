import { readFileSync } from "node:fs";
import macScript from "../data/scripts/mac.sh" with { type: "file" };
import { runScriptLogged } from "../runner.js";
import type { SetupTask } from "./registry.js";

export const macTask: SetupTask = {
	id: "mac",
	label: "MacOS defaults",
	hint: "Safari dev menu, Finder, Dock, Xcode CLT",
	async run() {
		await runScriptLogged("Configuring MacOS defaults", readFileSync(macScript, "utf8"));
	},
};
