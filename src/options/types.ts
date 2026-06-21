import type { AnyNode, SectionNode, schema, TimeValue } from "./schema";

type InferNode<N extends AnyNode> = N extends { kind: "bool" }
  ? boolean
  : N extends { kind: "time" }
    ? TimeValue
    : N extends SectionNode<infer C>
      ? { enabled: boolean } & { [K in keyof C]: InferNode<C[K]> }
      : never;

export type Options = InferNode<typeof schema>;
