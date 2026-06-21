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

export const presets: { name: string; options: DeepPartial<Options> }[] = [
  { name: "Recommended", options: defaults },
  { name: "All", options: setAll(schema, true) as DeepPartial<Options> },
  { name: "None", options: setAll(schema, false) as DeepPartial<Options> },
];
