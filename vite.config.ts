import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import tsconfigPaths from "vite-tsconfig-paths";

const generateManifest = () => {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");

  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,

    ...manifest,
  };
};

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ["package.json", "manifest.json"],
      webExtConfig: {
        chromiumProfile: "./chromiumDevelopment",
        keepProfileChanges: true,
        profileCreateIfMissing: true,
        startUrl: "https://youtube.com",
      },
    }),
  ],
});
