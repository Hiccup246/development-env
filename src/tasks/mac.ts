import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const macTask: SetupTask = {
	id: "mac",
	label: "MacOS defaults",
	hint: "Safari dev menu, Finder, Dock, Xcode CLT",
	run() {
		p.log.warn("mac task not yet implemented");
		return Promise.resolve();
	},
};
