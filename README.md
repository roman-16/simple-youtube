# Simple YouTube

A lightweight browser extension that declutters YouTube. It hides Shorts, short videos, the home feed's shelves, posts and topic chips, and lets you turn every feature on or off from the extension popup. Available for Chrome and Firefox.

## Features

Every feature is individually toggleable. Defaults are listed below, and your settings sync across your browser profile.

- **Home feed**
  - **Remove posts**: hide community posts. (on)
  - **Remove shelves**: hide the horizontal carousels, such as "Watch again" and "YouTube Playables". (on)
  - **Remove suggestion prompts**: hide the "Not interested?" nudge cards. (on)
  - **Remove topic chips**: hide the topic filter bar above the feed. (on)
- **Short videos**: hide videos at or below a maximum length (default `00:01:00`) on the home feed and in the watch page recommendations, optionally including the Subscriptions feed (off by default). Search results and channel pages are never filtered. (on)
- **Shorts**
  - **Redirect to the video page**: rewrite `/shorts/<id>` URLs to `/watch?v=<id>`. (on)
  - **Remove from feeds**: hide Shorts shelves and Shorts items in the home feed and in search results, optionally including the Subscriptions feed (off by default). (on)
  - **Remove from the channel tabs**: hide the Shorts tab on channel pages. (off)
  - **Remove from the sidebar**: hide Shorts in the sidebar and mini guide. (on)

The popup opens with a line reporting what the extension is doing on the page you have open, for example `On this page: 7 of 21 videos hidden`.

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

Built with [WXT](https://wxt.dev), React, Tailwind CSS, and TypeScript. Requires [Bun](https://bun.sh) (a [devbox](https://www.jetify.com/devbox) config is included for a reproducible toolchain).

```bash
git clone https://github.com/roman-16/simple-youtube.git
cd simple-youtube
bun install
bun run dev        # dev server with hot reload (Chromium; use `wxt -b firefox` for Firefox)
bun run build      # production bundles for both browsers into .output/
bun run zip        # packaged zips for both browsers
bun run test       # unit tests
bun run typecheck  # type-check
bunx biome check . # format and lint checks
```

### Fixtures

Everything the extension hides is matched against YouTube's rendered markup, which YouTube renames without notice. `tests/fixtures/` therefore holds markup captured verbatim from real YouTube pages - the home feed, search results, a watch page sidebar, a channel's tab bar, the sidebar and the mini sidebar - and the tests assert against those instead of hand-written stand-ins. When a feature stops working, save the page it should have worked on, replace the matching fixture with the relevant element, and run `bun run test` to see which selector reality has moved away from.
