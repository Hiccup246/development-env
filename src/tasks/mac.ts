import { runScriptLogged } from "../runner.js";
import { readData } from "../data/read.js";
import type { SetupTask } from "./registry.js";

export const macTask: SetupTask = {
	id: "mac",
	label: "MacOS defaults",
	hint: "Safari dev menu, Finder, Dock, Xcode CLT",
	async run() {
		await runScriptLogged("Configuring MacOS defaults", readData("scripts/mac.sh"));
	},
};
