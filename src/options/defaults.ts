import { type AnyNode, type SectionNode, schema } from "./schema";
import type { Options } from "./types";

function nodeDefault(node: AnyNode): unknown {
  switch (node.kind) {
    case "bool":
      return node.default;
    case "time":
      return { ...node.default };
    case "section":
      return sectionDefault(node);
    default:
      return undefined;
  }
}

function sectionDefault(node: SectionNode): Record<string, unknown> {
  const result: Record<string, unknown> = { enabled: node.default };

  for (const [key, child] of Object.entries(node.children)) {
    result[key] = nodeDefault(child);
  }

  return result;
}

export const defaults = sectionDefault(schema) as Options;
