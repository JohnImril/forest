import js from "@eslint/js";
import globals from "globals";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["dist", "tmp"]),
	{
		files: ["**/*.ts"],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},
	...svelte.configs.recommended,
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tseslint.parser,
				extraFileExtensions: [".svelte"],
			},
			globals: globals.browser,
		},
	},
]);
