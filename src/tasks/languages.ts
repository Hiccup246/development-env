import * as p from "@clack/prompts";
import type { SetupTask } from "./registry.js";

export const languagesTask: SetupTask = {
	id: "languages",
	label: "Languages",
	hint: "pyenv, fnm, rbenv, sdkman, clojure, deno, go",
	run() {
		p.log.warn("languages task not yet implemented");
		return Promise.resolve();
	},
};
