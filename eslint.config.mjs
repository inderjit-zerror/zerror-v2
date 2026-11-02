import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // The WebGL layer mutates Three.js objects every frame by design (and opts out of
  // compiler memoisation with 'use no memo'), so these two compiler rules don't apply there.
  {
    files: ["src/components/gl/**"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
