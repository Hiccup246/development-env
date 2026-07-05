import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import * as clackPrompt from "@clack/prompts";
import { runLogged, runCapture } from "../runner.js";
import { orThrow } from "../prompts.js";
import type { SetupTask } from "./registry.js";

interface GithubRepo {
	ssh_url: string;
	private: boolean;
	fork: boolean;
	archived: boolean;
}

const PAGE_SIZE = 100;

/** Fetches every page of a user's public repos (the API caps a page at 100). */
async function fetchRepoUrls(username: string): Promise<string[] | null> {
	const urls: string[] = [];

	for (let page = 1; ; page++) {
		const json = await runCapture(
			`curl -s -f "https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${PAGE_SIZE}&page=${page}"`,
		);
		if (json === null) return null;

		let repos: GithubRepo[];
		try {
			repos = JSON.parse(json) as GithubRepo[];
		} catch {
			return null;
		}

		for (const repo of repos) {
			if (!repo.private && !repo.fork && !repo.archived) urls.push(repo.ssh_url);
		}
		if (repos.length < PAGE_SIZE) return urls;
	}
}

async function cloneReposForUser(username: string, targetDir: string): Promise<void> {
	const s = clackPrompt.spinner();
	s.start(`Fetching repos for ${username}`);

	const repoUrls = await fetchRepoUrls(username);

	if (repoUrls === null) {
		s.error(`Could not fetch repos for ${username} — check the username`);
		return;
	}
	s.stop(`Found ${repoUrls.length} repos for ${username}`);

	if (repoUrls.length === 0) {
		clackPrompt.log.info(`No public, non-fork, non-archived repos found for ${username}`);
		return;
	}

	mkdirSync(targetDir, { recursive: true });
	for (const url of repoUrls) {
		await runLogged(`Cloning ${url}`, `git -C "${targetDir}" clone "${url}"`);
	}
}

/**
 * Bulk-clones repos from GitHub. Asks for a username and a folder to clone
 * into, fetches every public repo that isn't a fork or archived (paging
 * through the GitHub API since it caps each request at 100 results), then
 * clones each one with plain `git clone`. Can repeat for multiple usernames.
 */
export const githubTask: SetupTask = {
	id: "github",
	label: "GitHub repo cloning",
	hint: "clone all public repos from a user",
	async run() {
		const targetDir = orThrow(
			await clackPrompt.text({
				message: "Directory to clone repos into",
				initialValue: `${homedir()}/Dev`,
				validate: (input) => ((input ?? "").trim().length === 0 ? "Required" : undefined),
			}),
		).trim();

		for (;;) {
			const username = orThrow(
				await clackPrompt.text({
					message: "GitHub username to clone all public, non-archived, non-fork repos from",
					validate: (input) => ((input ?? "").trim().length === 0 ? "Required" : undefined),
				}),
			).trim();

			await cloneReposForUser(username, targetDir);

			const again = orThrow(
				await clackPrompt.confirm({
					message: "Clone repos from another GitHub user?",
					initialValue: false,
				}),
			);
			if (!again) break;
		}
	},
};
