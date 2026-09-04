import { readFileSync } from "node:fs";

const css = readFileSync("src/entrypoints/content/clutter.css", "utf8");

const selectors = [...css.matchAll(/([^{}]+)\{[^}]*\}/g)]
  .flatMap(([, list = ""]) => list.split(",").map((one) => one.trim()))
  .map((selector) => selector.replace(/\s+/g, " "))
  .filter(Boolean);

const label = (element: Element): string => {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();

  return `${tag}${id}${text ? ` "${text.slice(0, 24)}"` : ""}`;
};

export const load = (
  fixture: string,
  { flags = [], path }: { flags?: string[]; path?: string } = {},
) => {
  document.body.innerHTML = readFileSync(
    `tests/fixtures/${fixture}.html`,
    "utf8",
  );

  for (const flag of flags)
    document.documentElement.setAttribute(`data-sy-${flag}`, "");

  if (path) document.documentElement.setAttribute("data-sy-path", path);
};

export const targeted = (): string[] =>
  [
    ...new Set(
      selectors.flatMap((selector) => [...document.querySelectorAll(selector)]),
    ),
  ]
    .map(label)
    .sort();
