import { mkdirSync, readFileSync, writeFileSync, chmodSync, existsSync, lstatSync } from "node:fs";
import { homedir } from "node:os";
import * as p from "@clack/prompts";
import { runLogged, commandExists } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

interface DotfileEntry {
	relativePath: string;
	content: string;
	executable?: boolean;
}

const ZSHRC = readFileSync(new URL("../data/dotfiles/zsh/.zshrc", import.meta.url), "utf8");
const CLAUDE_SETTINGS = readFileSync(
	new URL("../data/dotfiles/claude/.claude/settings.json", import.meta.url),
	"utf8",
);
const CLAUDE_MD = readFileSync(
	new URL("../data/dotfiles/claude/.claude/CLAUDE.md", import.meta.url),
	"utf8",
);
const RTK_MD = readFileSync(
	new URL("../data/dotfiles/claude/.claude/RTK.md", import.meta.url),
	"utf8",
);
const STATUSLINE_SCRIPT = readFileSync(
	new URL("../data/dotfiles/claude/.claude/statusline-command.sh", import.meta.url),
	"utf8",
);

const PACKAGES: Record<string, DotfileEntry[]> = {
	zsh: [{ relativePath: ".zshrc", content: ZSHRC }],
	claude: [
		{ relativePath: ".claude/settings.json", content: CLAUDE_SETTINGS },
		{ relativePath: ".claude/CLAUDE.md", content: CLAUDE_MD },
		{ relativePath: ".claude/RTK.md", content: RTK_MD },
		{
			relativePath: ".claude/statusline-command.sh",
			content: STATUSLINE_SCRIPT,
			executable: true,
		},
	],
};

const DOTFILES_DIR = `${homedir()}/dotfiles`;

function materialize(): void {
	for (const [pkg, entries] of Object.entries(PACKAGES)) {
		for (const entry of entries) {
			const dest = `${DOTFILES_DIR}/${pkg}/${entry.relativePath}`;
			mkdirSync(dest.slice(0, dest.lastIndexOf("/")), { recursive: true });
			writeFileSync(dest, entry.content);
			if (entry.executable) chmodSync(dest, 0o755);
		}
	}
}

function isRealFileOrDir(path: string): boolean {
	try {
		return !lstatSync(path).isSymbolicLink();
	} catch {
		return false;
	}
}

async function backupIfReal(targetRelPath: string): Promise<void> {
	const target = `${homedir()}/${targetRelPath}`;
	if (isRealFileOrDir(target)) {
		await runLogged(`Backing up ~/${targetRelPath}`, `mv "${target}" "${target}.bak"`);
	}
}

export const dotfilesTask: SetupTask = {
	id: "dotfiles",
	label: "Dotfiles",
	hint: "stow ~/dotfiles -> home symlinks",
	async run() {
		if (!(await commandExists("stow"))) {
			throw new Error("stow not found — run the Homebrew task first");
		}

		if (existsSync(DOTFILES_DIR)) {
			const overwrite = orThrow(
				await p.confirm({
					message: "~/dotfiles already exists — overwrite with the embedded dotfiles?",
					initialValue: false,
				}),
			);
			if (!overwrite) {
				p.log.info("Keeping existing ~/dotfiles as-is");
				return;
			}
		}

		materialize();
		p.log.success(`Wrote dotfiles to ${DOTFILES_DIR}`);

		await backupIfReal(".zshrc");
		await backupIfReal(".claude/settings.json");
		await backupIfReal(".claude/CLAUDE.md");
		await backupIfReal(".claude/RTK.md");
		await backupIfReal(".claude/statusline-command.sh");

		await runLogged("Stowing zsh dotfiles", `stow -d "${DOTFILES_DIR}" -t "$HOME" zsh`);
		await runLogged(
			"Stowing claude dotfiles",
			`stow --no-folding -d "${DOTFILES_DIR}" -t "$HOME" claude`,
		);

		p.log.success("Dotfiles stowed — ~/dotfiles is now the source of truth");
	},
};
