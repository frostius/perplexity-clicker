# Perplexity Auto Clicker Userscript

This userscript automatically clicks away pop-ups and dialogs on [perplexity.ai](https://www.perplexity.ai/) to streamline your browsing experience.

## Features

- Detects and auto-clicks common pop-ups (sign-in, SSO, app download, etc.)
- Optionally shows a toast notification when an action is performed
- Customizable button/text matching logic

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Copy the contents of [`auto-clicker.js`](auto-clicker.js) into a new userscript.
3. Save and enable the script.

## How It Works

- The script defines a list of button selectors and associated text patterns to match pop-ups.
- When a matching button is found and visible, it is automatically clicked (or, for some, an Escape key event is sent).
- A toast notification appears (by default) to indicate the action taken.
- The script listens for DOM changes to catch dynamically loaded pop-ups.

## Customization

- To add or change which pop-ups are auto-clicked, edit the `BUTTONS` array in [`auto-clicker.js`](auto-clicker.js).
- Logging and toast notifications can be toggled via the constants at the top of the script.

## Disclaimer

This script is provided as-is. Use at your own risk.

---

**Author:** [frosti.us](https://frosti.us/)