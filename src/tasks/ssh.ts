import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const sshTask: SetupTask = {
	id: "ssh",
	label: "SSH config",
	hint: "generate config, ssh-add key",
	run() {
		p.log.warn("ssh task not yet implemented");
		return Promise.resolve();
	},
};
