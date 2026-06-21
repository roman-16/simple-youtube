import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  publicDir: "src/public",
  manifestVersion: 3,
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "Simple YouTube",
    permissions: ["storage"],
    host_permissions: ["*://*.youtube.com/*"],
    icons: {
      16: "icons/16.png",
      32: "icons/32.png",
      48: "icons/48.png",
      96: "icons/96.png",
      128: "icons/128.png",
    },
    browser_specific_settings: {
      gecko: {
        id: "roman@lerchster.dev",
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
  zip: {
    artifactTemplate: "{{browser}}-extension.zip",
    sourcesTemplate: "sources.zip",
  },
  webExt: {
    startUrls: ["https://youtube.com"],
  },
});
