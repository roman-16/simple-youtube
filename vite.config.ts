import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const generateManifest = () => {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");

  return {
    description: pkg.description,
    version: pkg.version,

    ...manifest,
  };
};

const browser = process.env.BROWSER ?? "chrome";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ["package.json", "manifest.json"],
      webExtConfig: {
        chromiumProfile: "./chromiumDevelopment",
        firefoxProfile: "./firefoxDevelopment",
        keepProfileChanges: true,
        profileCreateIfMissing: true,
        startUrl: "https://youtube.com",
        target: browser === "firefox" ? "firefox-desktop" : "chromium",
      },
      browser,
    }),
  ],
});
