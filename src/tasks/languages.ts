import * as clackPrompt from "@clack/prompts";
import { runLogged, runInteractive, runCapture, pathExists } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

type LanguageId = "python" | "node" | "ruby" | "java" | "clojure" | "deno" | "go";

async function installPython(): Promise<void> {
	await runLogged("Installing pyenv", "brew install pyenv");
	const version = await runCapture(
		"pyenv install --list | grep -E '^ *3\\.[0-9]+\\.[0-9]+$' | tail -1 | tr -d ' '",
	);
	if (!version) throw new Error("Could not determine latest Python version from pyenv");
	await runLogged(`Installing Python ${version}`, `pyenv install -s ${version}`);
	await runLogged(`Setting global Python to ${version}`, `pyenv global ${version}`);
}

async function installNode(): Promise<void> {
	await runLogged("Installing fnm", "brew install fnm");
	await runLogged("Installing latest Node.js LTS", "fnm install --lts");
	await runLogged("Setting default Node.js version", "fnm default lts-latest");
}

async function installRuby(): Promise<void> {
	await runLogged("Installing rbenv", "brew install rbenv ruby-build");
	const version = await runCapture("rbenv install -l | grep -v - | tail -1 | tr -d ' '");
	if (!version) throw new Error("Could not determine latest Ruby version from rbenv");
	await runLogged(`Installing Ruby ${version}`, `rbenv install -s ${version}`);
	await runLogged(`Setting global Ruby to ${version}`, `rbenv global ${version}`);
}

async function installJava(): Promise<void> {
	if (!(await pathExists("$HOME/.sdkman"))) {
		await runInteractive('curl -s "https://get.sdkman.io" | bash');
	}
	clackPrompt.log.step("Launching sdkman — pick a Java candidate when prompted");
	await runInteractive('bash -c \'source "$HOME/.sdkman/bin/sdkman-init.sh" && sdk install java\'');
}

async function installClojure(): Promise<void> {
	await runLogged("Installing Clojure CLI", "brew install clojure/tools/clojure rlwrap");
}

async function installDeno(): Promise<void> {
	await runLogged("Installing Deno", "brew install deno");
}

async function installGo(): Promise<void> {
	await runLogged("Installing Go", "brew install go");
}

const INSTALLERS: Record<LanguageId, () => Promise<void>> = {
	python: installPython,
	node: installNode,
	ruby: installRuby,
	java: installJava,
	clojure: installClojure,
	deno: installDeno,
	go: installGo,
};

export const languagesTask: SetupTask = {
	id: "languages",
	label: "Languages",
	hint: "pyenv, fnm, rbenv, sdkman, clojure, deno, go",
	async run() {
		const selected = orThrow(
			await clackPrompt.multiselect<LanguageId>({
				message: "Which languages do you want to install?",
				options: [
					{ value: "python", label: "Python", hint: "via pyenv" },
					{ value: "node", label: "Node.js", hint: "via fnm" },
					{ value: "ruby", label: "Ruby", hint: "via rbenv" },
					{ value: "java", label: "Java", hint: "via sdkman" },
					{ value: "clojure", label: "Clojure", hint: "installs Java too, via brew" },
					{ value: "deno", label: "Deno", hint: "via brew" },
					{ value: "go", label: "Go", hint: "via brew" },
				],
				required: false,
			}),
		);

		const toInstall = new Set(selected);
		if (toInstall.has("clojure") && !toInstall.has("java")) {
			toInstall.add("java");
		}

		for (const id of toInstall) {
			await INSTALLERS[id]();
		}
	},
};
