import { runLogged } from "../runner.js";
import type { SetupTask } from "./registry.js";

/**
 * Installs Mac App Store apps using `mas` (a CLI for the App Store). Just
 * Flycut (a clipboard manager) for now, referenced by its numeric App Store ID.
 */
export const appstoreTask: SetupTask = {
	id: "appstore",
	label: "App Store apps",
	hint: "Flycut",
	async run() {
		await runLogged("Installing Flycut via mas", "mas install 442160987");
	},
};
