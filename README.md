# Simple YouTube

A lightweight browser extension that declutters YouTube. It hides Shorts, the "Watch again" history shelf, community posts, explore sections, and short videos, and lets you turn every feature on or off from the extension popup. Available for Chrome and Firefox.

## Features

Every feature is individually toggleable. Defaults are listed below, and your settings sync across your browser profile.

- **Remove community posts** from the home feed. (on)
- **Remove explore filter** chips from the home feed. (on)
- **Remove explore more** section from the home feed. (on)
- **Shorts**
  - **Redirect to video**: rewrite `/shorts/<id>` URLs to the regular watch page `/watch?v=<id>`. (on)
  - **Remove from channel**: hide the Shorts tab on channel pages. (on)
  - **Remove from explore**: hide Shorts shelves in feeds, optionally including the Subscriptions feed (off by default). (on)
  - **Remove from navigation**: hide Shorts in the sidebar and mini guide. (on)
- **Videos**
  - **Remove watch again**: hide the "Watch again" history shelf. (on)
  - **Remove short videos**: hide videos below a configurable maximum length (default `00:01:00`), optionally including the Subscriptions feed (off by default). (on)

### Presets

The popup includes three one-click presets:

- **Recommended**: the default configuration.
- **All**: enable every feature.
- **None**: disable every feature.

## Installation

- **Chrome**: install from the [Chrome Web Store](https://chromewebstore.google.com/detail/simple-youtube/iecgbpoggpmlohjeojnjjihabobaaeek).
- **Firefox**: install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/simple-youtube).

Once installed, open YouTube and the extension applies your configuration automatically. Click the toolbar icon to open the popup and adjust settings; changes take effect live.

## Development

Built with [WXT](https://wxt.dev), React, Tailwind CSS, and TypeScript. Requires Node.js 20.12+ (a [devbox](https://www.jetify.com/devbox) config is included for a reproducible toolchain).

```bash
git clone https://github.com/roman-16/simple-youtube.git
cd simple-youtube
npm install
npm run dev        # dev server with hot reload (Chromium; use `wxt -b firefox` for Firefox)
npm run build      # production bundles for both browsers into .output/
npm run zip        # packaged zips for both browsers
npm run typecheck  # type-check
npx biome check .  # format and lint checks
```
