import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const quality = require("./eslint-rules/index.cjs");

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".quality/**",
    "evals/**",
    "eslint-rules/**",
  ]),
  {
    plugins: { quality },
    rules: {
      "quality/max-lines": ["error", { max: 350, skipBlankLines: false, skipComments: false }],
      "quality/no-direct-console": ["error", { allowedPaths: ["scripts/**", "src/lib/logger.*"] }],
      "quality/no-direct-data-access": ["error", {
        modules: ["@prisma/client", "@supabase/supabase-js", "drizzle-orm", "pg", "mongoose"],
        allowedPaths: ["src/services/**", "src/server/**"],
        checkFetch: true,
      }],
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["scripts/**", "eslint-rules/**", "*.config.*"],
    rules: {
      "quality/no-direct-console": "off",
      "quality/no-direct-data-access": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);

export default eslintConfig;
