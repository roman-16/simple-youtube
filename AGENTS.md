# Simple YouTube

- The popup's look is a copy of the design system in `~/.nixos/shared/design`: `src/entrypoints/popup/design/tokens.css` holds its palettes and font, `design.css` its roles and the parts the popup uses, rule for rule. It is a copy because that repository is private and the stores' reviewers build the extension from this one alone. A color, a size or a part changes in the system first and is copied here afterwards, and a component never writes one of its own.
