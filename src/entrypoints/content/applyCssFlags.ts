import { type AnyNode, schema } from "@/options/schema";
import type { Options } from "@/options/storage";

const PREFIX = "data-sy-";
const PATH = `${PREFIX}path`;

const collect = (
  node: AnyNode,
  value: unknown,
  enabled: boolean,
  flags: Set<string>,
) => {
  if (node.kind === "time") return;

  const on =
    enabled &&
    (node.kind === "bool"
      ? value === true
      : (value as { enabled: boolean }).enabled);

  if (on && node.css) flags.add(node.css);
  if (node.kind !== "section") return;

  for (const [key, child] of Object.entries(node.children))
    collect(child, (value as Record<string, unknown>)[key], on, flags);
};

export const cssFlags = (options: Options): Set<string> => {
  const flags = new Set<string>();
  collect(schema, options, true, flags);

  return flags;
};

export const applyCssFlags = (options: Options) => {
  const flags = cssFlags(options);
  const root = document.documentElement;

  for (const name of root.getAttributeNames())
    if (
      name.startsWith(PREFIX) &&
      name !== PATH &&
      !flags.has(name.slice(PREFIX.length))
    )
      root.removeAttribute(name);

  for (const flag of flags) root.setAttribute(`${PREFIX}${flag}`, "");
};
