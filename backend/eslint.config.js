const js = require("@eslint/js");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        // Node.js globals
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        // Jest globals
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", {
        argsIgnorePattern: "^_|next|req|res",
        varsIgnorePattern: "^_",
      }],
      "no-console": "off",
      "no-var": "error",
      "prefer-const": "warn",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-throw-literal": "error",
    },
    ignores: ["node_modules/**", "data/**", "coverage/**"],
  },
];
