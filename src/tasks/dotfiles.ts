import { mkdirSync, readFileSync, writeFileSync, chmodSync, existsSync, lstatSync } from "node:fs";
import { homedir } from "node:os";
import * as clackPrompt from "@clack/prompts";
import zshrcPath from "../data/dotfiles/zsh/.zshrc" with { type: "file" };
import claudeSettingsPath from "../data/dotfiles/claude/.claude/settings.json.txt" with { type: "file" };
import claudeMdPath from "../data/dotfiles/claude/.claude/CLAUDE.md" with { type: "file" };
import rtkMdPath from "../data/dotfiles/claude/.claude/RTK.md" with { type: "file" };
import statuslineScriptPath from "../data/dotfiles/claude/.claude/statusline-command.sh" with { type: "file" };
import { runLogged, commandExists } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

interface DotfileEntry {
	relativePath: string;
	content: string;
	executable?: boolean;
}

const ZSHRC = readFileSync(zshrcPath, "utf8");
const CLAUDE_SETTINGS = readFileSync(claudeSettingsPath, "utf8");
const CLAUDE_MD = readFileSync(claudeMdPath, "utf8");
const RTK_MD = readFileSync(rtkMdPath, "utf8");
const STATUSLINE_SCRIPT = readFileSync(statuslineScriptPath, "utf8");

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
	if (!isRealFileOrDir(target)) return;

	// A fresh suffix each time: `mv` onto an existing .bak directory would
	// nest the target inside it instead of replacing it
	const backup = existsSync(`${target}.bak`) ? `${target}.bak-${Date.now()}` : `${target}.bak`;
	await runLogged(`Backing up ~/${targetRelPath}`, `mv "${target}" "${backup}"`);
}

/**
 * Installs this repo's personal config files (dotfiles) onto the machine.
 * Two steps: first it writes the embedded copies out to ~/dotfiles, backing
 * up anything real that's already at the destination; then it uses `stow` to
 * symlink them into place in the home directory, so ~/dotfiles stays the one
 * place you'd edit them going forward.
 */
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
				await clackPrompt.confirm({
					message: "~/dotfiles already exists — overwrite with the embedded dotfiles?",
					initialValue: false,
				}),
			);
			if (!overwrite) {
				clackPrompt.log.info("Keeping existing ~/dotfiles as-is");
				return;
			}
		}

		materialize();
		clackPrompt.log.success(`Wrote dotfiles to ${DOTFILES_DIR}`);

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

		clackPrompt.log.success("Dotfiles stowed — ~/dotfiles is now the source of truth");
	},
};
