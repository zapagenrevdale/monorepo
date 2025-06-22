import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/runner.ts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm"],
	noExternal: ["@gdz/db"],
});
