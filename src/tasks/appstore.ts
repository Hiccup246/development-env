import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const appstoreTask: SetupTask = {
	id: "appstore",
	label: "App Store apps",
	hint: "Flycut",
	run() {
		p.log.warn("appstore task not yet implemented");
		return Promise.resolve();
	},
};
