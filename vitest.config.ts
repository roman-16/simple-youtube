import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    mockReset: true,
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    unstubGlobals: true,
  },
});
