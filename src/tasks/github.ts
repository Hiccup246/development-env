import * as p from "@clack/prompts";
import { runLogged, runCapture } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

const REPO_FILTER =
	'.[] | select(.private==false) | select(.fork==false) | select(.archived==false) | .ssh_url';

async function cloneReposForUser(username: string): Promise<void> {
	const s = p.spinner();
	s.start(`Fetching repos for ${username}`);

	const urls = await runCapture(
		`bash -c 'set -o pipefail && curl -s -f "https://api.github.com/users/${username}/repos" | jq -r "${REPO_FILTER}"'`,
	);

	if (urls === null) {
		s.error(`Could not fetch repos for ${username} — check the username`);
		return;
	}
	s.stop(`Found repos for ${username}`);

	const repoUrls = urls.split("\n").filter(Boolean);
	if (repoUrls.length === 0) {
		p.log.info(`No public, non-fork, non-archived repos found for ${username}`);
		return;
	}

	for (const url of repoUrls) {
		await runLogged(`Cloning ${url}`, `git clone ${url}`);
	}
}

export const githubTask: SetupTask = {
	id: "github",
	label: "GitHub repo cloning",
	hint: "clone all public repos from a user",
	async run() {
		for (;;) {
			const username = orThrow(
				await p.text({
					message: "GitHub username to clone all public, non-archived, non-fork repos from",
					validate: (input) => ((input ?? "").trim().length === 0 ? "Required" : undefined),
				}),
			).trim();

			await cloneReposForUser(username);

			const again = orThrow(
				await p.confirm({
					message: "Clone repos from another GitHub user?",
					initialValue: false,
				}),
			);
			if (!again) break;
		}
	},
};
