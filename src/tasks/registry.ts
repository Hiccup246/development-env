import { macTask } from "./mac.js";
import { homebrewTask } from "./homebrew.js";
import { shellTask } from "./shell.js";
import { appstoreTask } from "./appstore.js";
import { gitTask } from "./git.js";
import { languagesTask } from "./languages.js";
import { rustTask } from "./rust.js";
import { vscodeTask } from "./vscode.js";
import { dotfilesTask } from "./dotfiles.js";
import { aiTask } from "./ai.js";
import { sshTask } from "./ssh.js";

export interface SetupTask {
	id: string;
	label: string;
	hint: string;
	run: () => Promise<void>;
}

/**
 * All setup tasks in recommended execution order. Guided mode runs this list
 * top to bottom (minus unchecked items); pick-tasks mode selects one at a time.
 */
export const taskRegistry: SetupTask[] = [
	macTask,
	homebrewTask,
	shellTask,
	appstoreTask,
	gitTask,
	languagesTask,
	rustTask,
	vscodeTask,
	dotfilesTask,
	aiTask,
	sshTask,
];
