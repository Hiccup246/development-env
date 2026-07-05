import * as p from "@clack/prompts";
import { runInteractive, runLogged, pathExists } from "../runner.js";
import type { SetupTask } from "./registry.js";

const PLUGIN_REPOS: Record<string, string> = {
	"zsh-autosuggestions": "https://github.com/zsh-users/zsh-autosuggestions",
	"zsh-syntax-highlighting": "https://github.com/zsh-users/zsh-syntax-highlighting.git",
	"zsh-completions": "https://github.com/zsh-users/zsh-completions",
};

async function addToEtcShells(shellPath: string): Promise<void> {
	await runInteractive(
		`sudo sh -c 'grep -qxF "${shellPath}" /etc/shells || echo "${shellPath}" >> /etc/shells'`,
	);
}

export const shellTask: SetupTask = {
	id: "shell",
	label: "Shells",
	hint: "homebrew bash + zsh, oh-my-zsh, plugins",
	async run() {
		p.log.info("Adding homebrew bash and zsh to /etc/shells — this needs your sudo password");
		await addToEtcShells("/usr/local/bin/bash");
		await addToEtcShells("/usr/local/bin/zsh");

		await runLogged("Suppressing login message", "touch ~/.hushlogin");

		if (await pathExists("$HOME/.oh-my-zsh")) {
			p.log.success("oh-my-zsh already installed");
		} else {
			// RUNZSH/CHSH disabled so the installer doesn't spawn a nested shell or
			// prompt interactively; KEEP_ZSHRC leaves ~/.zshrc for the dotfiles task to own.
			await runInteractive(
				'RUNZSH=no CHSH=no KEEP_ZSHRC=yes sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"',
			);
		}

		for (const [name, url] of Object.entries(PLUGIN_REPOS)) {
			const dir = `\${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/${name}`;
			if (await pathExists(dir)) {
				p.log.success(`${name} already installed`);
				continue;
			}
			await runLogged(`Cloning ${name}`, `git clone ${url} "${dir}"`);
		}

		await runInteractive("chsh -s /bin/zsh");
		p.log.success("Shell configuration complete");
	},
};
