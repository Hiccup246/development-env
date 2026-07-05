import { runLogged } from "../runner.js";
import type { SetupTask } from "./registry.js";

export const appstoreTask: SetupTask = {
	id: "appstore",
	label: "App Store apps",
	hint: "Flycut",
	async run() {
		await runLogged("Installing Flycut via mas", "mas install 442160987");
	},
};
