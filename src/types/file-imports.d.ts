// Data assets are imported with `with { type: "file" }` so Bun's bundler embeds
// them into the compiled binary. That attribute resolves the import to a string
// path (real path in dev, virtual $bunfs path when compiled) rather than parsed
// content, so these ambient modules override the usual content-shaped typing.

declare module "*.txt" {
	const path: string;
	export default path;
}

declare module "*.sh" {
	const path: string;
	export default path;
}

declare module "*.zshrc" {
	const path: string;
	export default path;
}

declare module "*.md" {
	const path: string;
	export default path;
}
