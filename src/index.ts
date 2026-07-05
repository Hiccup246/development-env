import * as clackPrompt from "@clack/prompts";
import { taskRegistry, type SetupTask } from "./tasks/registry.js";
import { githubTask } from "./tasks/github.js";
import { configureGitIdentity } from "./tasks/git.js";

type TaskOutcome = "ran" | "skipped" | "failed";

function exitOnCancel(value: unknown): asserts value is Exclude<unknown, symbol> {
	if (clackPrompt.isCancel(value)) {
		clackPrompt.cancel("Setup aborted");
		process.exit(0);
	}
}

async function runTask(task: SetupTask): Promise<TaskOutcome> {
	for (;;) {
		try {
			await task.run();
			return "ran";
		} catch (err) {
			clackPrompt.log.error(err instanceof Error ? err.message : String(err));

			const choice = await clackPrompt.select({
				message: `${task.label} failed. What now?`,
				options: [
					{ value: "retry", label: "Retry" },
					{ value: "skip", label: "Skip and continue" },
					{ value: "abort", label: "Abort setup" },
				],
			});
			exitOnCancel(choice);

			if (choice === "retry") continue;
			if (choice === "skip") return "failed";

			clackPrompt.cancel("Setup aborted");
			process.exit(0);
		}
	}
}

async function guidedSetup(outcomes: Map<string, TaskOutcome>): Promise<void> {
	const selected = await clackPrompt.multiselect({
		message: "Select setup tasks to run",
		options: taskRegistry.map((task) => ({
			value: task.id,
			label: task.label,
			hint: task.hint,
		})),
		initialValues: taskRegistry.map((task) => task.id),
		required: false,
	});
	exitOnCancel(selected);

	const selectedIds = new Set(selected as string[]);

	for (const task of taskRegistry) {
		if (!selectedIds.has(task.id)) {
			outcomes.set(task.id, "skipped");
			continue;
		}
		outcomes.set(task.id, await runTask(task));
	}
}

async function pickTasks(outcomes: Map<string, TaskOutcome>): Promise<void> {
	for (;;) {
		const choice = await clackPrompt.select({
			message: "Pick a task to run",
			options: [
				...taskRegistry.map((task) => ({
					value: task.id,
					label: task.label,
					hint: task.hint,
				})),
				{ value: "__exit", label: "Done — return to summary" },
			],
		});
		exitOnCancel(choice);

		if (choice === "__exit") return;

		const task = taskRegistry.find((t) => t.id === choice);
		if (!task) continue;

		outcomes.set(task.id, await runTask(task));
	}
}

const MANUAL_STEPS = [
	"- iTerm: profile font FiraCode Nerd Font, Solarized Dark, Natural Text Editing keys",
	"- AltTab: hide space labels, hide status icons",
	"- Chrome: install Bitwarden, Wappalyzer, AdBlock, Tabliss, ColorPick Eyedropper",
	"- Flycut: set Clippings remember to 40",
	"- codiff: run 'Codiff > Install Terminal Helper' from the app menu",
	"- VSCode: copy vscode-config.json into your settings.json",
].join("\n");

const gitIdentityTask: SetupTask = {
	id: "git-identity",
	label: "Git identity",
	hint: "email, name, display name",
	run: configureGitIdentity,
};

function printOutro(outcomes: Map<string, TaskOutcome>): void {
	if (outcomes.size > 0) {
		const counts = { ran: 0, skipped: 0, failed: 0 };
		for (const outcome of outcomes.values()) counts[outcome]++;

		clackPrompt.note(MANUAL_STEPS, "Manual configuration");
		clackPrompt.outro(
			`Setup complete — ${counts.ran} ran, ${counts.skipped} skipped, ${counts.failed} failed`,
		);
	} else {
		clackPrompt.outro("Bye");
	}
}

async function main() {
	clackPrompt.intro("development-env setup");
	clackPrompt.note(
		"Clone GitHub user's repos, Reconfigure git identity",
		"If you need to reconfigure after install",
	);

	for (;;) {
		const mode = await clackPrompt.select({
			message: "What do you want to do?",
			options: [
				{
					value: "guided",
					label: "Guided setup",
					hint: "runs everything in recommended order",
				},
				{ value: "pick", label: "Pick individual tasks" },
				{
					value: "github-clone",
					label: "Clone GitHub user's repos",
					hint: "independent of setup — run anytime",
				},
				{
					value: "git-identity",
					label: "Reconfigure git identity",
					hint: "independent of setup — run anytime",
				},
				{ value: "exit", label: "Exit" },
			],
		});
		exitOnCancel(mode);

		if (mode === "exit") {
			clackPrompt.outro("Bye");
			return;
		}

		if (mode === "github-clone") {
			await runTask(githubTask);
			continue;
		}

		if (mode === "git-identity") {
			await runTask(gitIdentityTask);
			continue;
		}

		const outcomes = new Map<string, TaskOutcome>();

		if (mode === "guided") {
			await guidedSetup(outcomes);
		} else {
			await pickTasks(outcomes);
		}

		printOutro(outcomes);
		return;
	}
}

void main();
