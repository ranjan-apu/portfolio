import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "portfolio",
		compatibilityDate: "2026-10-05",
		compatibilityFlags: [],
		assets: {
			notFoundHandling: "404-page",
		},
		placement: {
			mode: "smart",
		},
		cache: {
			enabled: true,
		},
	},
});
