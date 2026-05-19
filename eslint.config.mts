import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import type { Linter } from "eslint";

const config: Linter.Config[] = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".expo/**",
      "coverage/**",
      "babel.config.js",
      "metro.config.js",
      "jest.config.js",
    ],
  },

  js.configs.recommended,

  { //i will remove this config after i will fix all the warnings
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "no-redeclare": "warn",
      "no-constant-condition": "warn",
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
      prettier: prettierPlugin,
    },

    rules: {
      "prettier/prettier": "warn", //error

      /*"@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],*/
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",  //error
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "warn", //error
      "@typescript-eslint/no-misused-promises": "warn", //error
      "@typescript-eslint/await-thenable": "warn", //error

      // ── React ────────────────────────────────────────────────────────────────
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "warn",
      "react/no-unknown-property": "warn", //error
      "react/jsx-no-duplicate-props": "warn", //error
      "react/jsx-no-undef": "warn", //error
      "react/jsx-uses-vars": "warn", //error
      "react/no-deprecated": "warn",

      // ── React Hooks ──────────────────────────────────────────────────────────
      "react-hooks/rules-of-hooks": "warn", //error
      "react-hooks/exhaustive-deps": "warn",

      // ── React Native ─────────────────────────────────────────────────────────
      "react-native/no-unused-styles": "warn", //error
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "warn",
      "react-native/no-color-literals": "warn",
      "react-native/no-raw-text": "off",

      // ── JavaScript general ───────────────────────────────────────────────────
      "no-console": ["warn", { allow: ["warn"] }], //add error
      "no-debugger": "warn", //error
      "no-duplicate-imports": "warn", //error
      eqeqeq: ["warn", "always"],
      "prefer-const": "warn", //error
      "no-var": "warn",                 //error        
      "object-shorthand": "warn",   //error
      "no-unused-expressions": "warn", //error
    },
  },

  prettierConfig,
];

export default config;
