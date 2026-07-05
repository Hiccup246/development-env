import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as clackPrompt from "@clack/prompts";

export class CommandError extends Error {
	constructor(
		public readonly command: string,
		public readonly exitCode: number | null,
	) {
		super(`Command failed (exit ${exitCode ?? "unknown"}): ${command}`);
	}
}

function waitForLoggedExit(child: ChildProcess, title: string, label: string): Promise<void> {
	const log = clackPrompt.taskLog({ title });

	child.stdout?.on("data", (chunk: Buffer) => log.message(chunk.toString().trimEnd()));
	child.stderr?.on("data", (chunk: Buffer) => log.message(chunk.toString().trimEnd()));

	return new Promise<void>((resolve, reject) => {
		child.on("error", (err) => reject(err));
		child.on("close", (code) => {
			if (code === 0) {
				log.success(title);
				resolve();
			} else {
				log.error(`${title} failed`, { showLog: true });
				reject(new CommandError(label, code));
			}
		});
	});
}

function waitForInteractiveExit(child: ChildProcess, label: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		child.on("error", (err) => reject(err));
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new CommandError(label, code));
			}
		});
	});
}

/**
 * Runs a shell command, streaming stdout/stderr into a clack taskLog.
 * The log collapses on success and stays expanded on failure.
 */
export async function runLogged(title: string, command: string): Promise<void> {
	const child = spawn(command, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
	await waitForLoggedExit(child, title, command);
}

/**
 * Runs a shell command with the terminal attached directly (stdin/stdout/stderr
 * inherited). Required for interactive steps like `sudo`, `read`, or browser-based
 * auth flows that a piped taskLog cannot drive.
 */
export async function runInteractive(command: string): Promise<void> {
	const child = spawn(command, { shell: true, stdio: "inherit" });
	await waitForInteractiveExit(child, command);
}

/**
 * Runs embedded script content through bash via stdin, streaming into a taskLog.
 * No temp file needed: safe only for scripts that never read from stdin themselves.
 */
export async function runScriptLogged(title: string, script: string): Promise<void> {
	const child = spawn("bash", [], { stdio: ["pipe", "pipe", "pipe"] });
	child.stdin?.end(script);
	await waitForLoggedExit(child, title, "<script>");
}

/**
 * Runs embedded script content with the terminal attached directly. Writes to a
 * real temp file rather than piping via stdin, because piping would hand the
 * script's own stdin (needed for things like a `sudo` password prompt) straight
 * to the script content instead of the terminal.
 */
export async function runScriptInteractive(script: string): Promise<void> {
	const dir = mkdtempSync(join(tmpdir(), "devenv-"));
	const file = join(dir, "script.sh");
	writeFileSync(file, script, { mode: 0o755 });
	try {
		const child = spawn("bash", [file], { stdio: "inherit" });
		await waitForInteractiveExit(child, file);
	} finally {
		rmSync(file, { force: true, recursive: true });
	}
}

/** Runs a quick command and resolves to its trimmed stdout, or null on failure. */
export async function runCapture(command: string): Promise<string | null> {
	return new Promise((resolve) => {
		const child = spawn(command, {
			shell: true,
			stdio: ["ignore", "pipe", "ignore"],
		});

		let out = "";
		child.stdout?.on("data", (chunk: Buffer) => {
			out += chunk.toString();
		});

		child.on("error", () => resolve(null));
		child.on("close", (code) => {
			resolve(code === 0 ? out.trim() : null);
		});
	});
}

/** Checks whether a binary is available on PATH. */
export async function commandExists(bin: string): Promise<boolean> {
	const result = await runCapture(`command -v ${bin}`);
	return result !== null && result.length > 0;
}

/** Checks whether a file or directory exists at the given path. */
export async function pathExists(path: string): Promise<boolean> {
	const result = await runCapture(`[ -e "${path}" ] && echo yes`);
	return result === "yes";
}
