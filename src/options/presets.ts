import { defaults } from "./defaults";
import type { DeepPartial } from "./merge";
import { type SectionNode, schema } from "./schema";
import type { Options } from "./types";

function setAll(node: SectionNode, value: boolean): Record<string, unknown> {
  const result: Record<string, unknown> = { enabled: value };

  for (const [key, child] of Object.entries(node.children)) {
    if (child.kind === "time") continue;
    result[key] = child.kind === "section" ? setAll(child, value) : value;
  }

  return result;
}

export const presets = [
  {
    id: "recommended",
    label: "Reset to recommended",
    options: defaults as DeepPartial<Options>,
    receipt: "Reset to recommended",
  },
  {
    id: "all",
    label: "Turn everything on",
    options: setAll(schema, true) as DeepPartial<Options>,
    receipt: "Everything turned on",
  },
  {
    id: "none",
    label: "Turn everything off",
    options: setAll(schema, false) as DeepPartial<Options>,
    receipt: "Everything turned off",
  },
] as const;

export type Preset = (typeof presets)[number];
