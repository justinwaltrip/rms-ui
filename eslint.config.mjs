import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import unusedImports from "eslint-plugin-unused-imports";

// Resolve the current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create compatibility object
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// Export ESLint configuration
export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
      import: fixupPluginRules(_import),
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2024, // Matches "ESNext" target
      sourceType: "module",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json", // Ensure this is correct for your project
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
        jsxPragma: null, // For React JSX Transform
        jsxFragmentPragma: null, // For React JSX Transform
        EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true, // For project references
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
        node: {
          moduleDirectory: ["node_modules", "src/"],
        },
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
    rules: {
      // General import sorting rules
      "sort-imports": [
        "error",
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
          allowSeparatedGroups: true,
        },
      ],
      // Ensure all imports are resolved properly
      "import/no-unresolved": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["sibling", "parent"],
            "index",
            "unknown",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // Fine-tune rules related to TypeScript
      "@typescript-eslint/explicit-module-boundary-types": "off", // Relax rules for explicit return types
      "@typescript-eslint/no-non-null-assertion": "off", // Allow non-null assertions
      "@typescript-eslint/no-explicit-any": "warn", // Warn on `any` usage to stay aware

      // Optional: Disable `await-thenable` since it requires type-checking via `parserOptions.project`
      "@typescript-eslint/await-thenable": "off",

      // Automatically remove unused imports
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
