// Tests run against temporary workshops only (tests/helpers.mjs); never the real one.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.mjs"],
    environment: "node",
    pool: "forks", // each file in its own process: tests set process.env (HISTFILE…)
    env: { BOS_SKRYBA: "0" }, // never call a real ollama from tests; skryba.test.mjs uses a fake raven
  },
});
