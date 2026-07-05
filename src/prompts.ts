import * as clackPrompt from "@clack/prompts";

/** Unwraps a clack prompt result, throwing so the task-retry menu can handle cancellation. */
export function orThrow<T>(value: T | symbol): T {
	if (clackPrompt.isCancel(value)) {
		throw new Error("Cancelled");
	}
	return value;
}
