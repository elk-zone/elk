import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  eslintPluginUnicorn.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "dist",
      "docs",
      "coverage",
      "playground",
      "**/__tests__/",
      "**/__mocks__/",
    ],
  },
  {
    files: ["**/*.{js,ts}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": "error",
      "no-unused-vars": "off",
      "import/no-cycle": "error",
      "simple-import-sort/imports": "error",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-array-reduce": "off",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "no-public" },
      ],
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "ws",
              message: "Use `isomophic-ws` instead.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["examples/**"],
    languageOptions: {
      parserOptions: {
        project: "./examples/tsconfig.json",
      },
    },
    rules: {
      "no-console": "off",
      "import/no-unresolved": "off",
      "unicorn/prefer-top-level-await": "off",
      "unicorn/no-process-exit": "off",
    },
  },
  {
    files: ["tests/**/*.ts", "test-utils/**/*.ts", "**/*.spec.ts"],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      "no-constant-condition": "off",
    },
  },
);
