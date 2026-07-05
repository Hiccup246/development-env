import * as p from "@clack/prompts";
import { runLogged, runCapture } from "../runner.js";
import type { SetupTask } from "./registry.js";

const SAFARI_DEV_DEFAULTS = [
	"defaults write com.apple.Safari IncludeInternalDebugMenu -bool true",
	"defaults write com.apple.Safari IncludeDevelopMenu -bool true",
	"defaults write com.apple.Safari WebKitDeveloperExtrasEnabledPreferenceKey -bool true",
	"defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2DeveloperExtrasEnabled -bool true",
	"defaults write NSGlobalDomain WebKitDeveloperExtras -bool true",
].join(" && ");

const FINDER_DEFAULTS = [
	"defaults write com.apple.finder ShowStatusBar -bool true",
	"defaults write com.apple.finder ShowPathbar -bool true",
	"defaults write NSGlobalDomain AppleShowAllExtensions -bool true",
	'defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"',
].join(" && ");

const DOCK_AND_LIBRARY = [
	"chflags nohidden ~/Library",
	"defaults write com.apple.dock show-recents -bool FALSE",
].join(" && ");

export const macTask: SetupTask = {
	id: "mac",
	label: "MacOS defaults",
	hint: "Safari dev menu, Finder, Dock, Xcode CLT",
	async run() {
		await runLogged("Configuring Safari for development", SAFARI_DEV_DEFAULTS);
		await runLogged("Configuring Finder", FINDER_DEFAULTS);
		await runLogged("Unhiding ~/Library, disabling Dock recents", DOCK_AND_LIBRARY);

		const cltInstalled = await runCapture("xcode-select -p");
		if (cltInstalled) {
			p.log.success("Xcode command line tools already installed");
		} else {
			p.log.step("Installing Xcode command line tools — follow the GUI prompt");
			await runLogged("Installing Xcode command line tools", "xcode-select --install");
		}
	},
};
