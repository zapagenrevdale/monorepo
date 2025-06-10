import * as path from "node:path";
import js from "@eslint/js"
import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigPrettier from "eslint-config-prettier"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"
import perfectionist from "eslint-plugin-perfectionist"

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  includeIgnoreFile(path.join(import.meta.dirname, "../../.gitignore")),
  { ignores: ["dist/**", "**/*.json"] },
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  perfectionist.configs["recommended-alphabetical"],
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      ...turboPlugin.configs.recommended.rules,
      "turbo/no-undeclared-env-vars": "off",
    },
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    },
  },
]
