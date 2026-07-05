import { spawn } from "node:child_process";
import * as p from "@clack/prompts";

export class CommandError extends Error {
	constructor(
		public readonly command: string,
		public readonly exitCode: number | null,
	) {
		super(`Command failed (exit ${exitCode ?? "unknown"}): ${command}`);
	}
}

/**
 * Runs a shell command, streaming stdout/stderr into a clack taskLog.
 * The log collapses on success and stays expanded on failure.
 */
export async function runLogged(title: string, command: string): Promise<void> {
	const log = p.taskLog({ title });

	await new Promise<void>((resolve, reject) => {
		const child = spawn(command, {
			shell: true,
			stdio: ["ignore", "pipe", "pipe"],
		});

		child.stdout?.on("data", (chunk: Buffer) => {
			log.message(chunk.toString().trimEnd());
		});
		child.stderr?.on("data", (chunk: Buffer) => {
			log.message(chunk.toString().trimEnd());
		});

		child.on("error", (err) => reject(err));
		child.on("close", (code) => {
			if (code === 0) {
				log.success(title);
				resolve();
			} else {
				log.error(`${title} failed`, { showLog: true });
				reject(new CommandError(command, code));
			}
		});
	});
}

/**
 * Runs a shell command with the terminal attached directly (stdin/stdout/stderr
 * inherited). Required for interactive steps like `sudo`, `read`, or browser-based
 * auth flows that a piped taskLog cannot drive.
 */
export async function runInteractive(command: string): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		const child = spawn(command, { shell: true, stdio: "inherit" });
		child.on("error", (err) => reject(err));
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new CommandError(command, code));
			}
		});
	});
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
