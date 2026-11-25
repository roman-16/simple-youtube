import { useState } from "react";
import type { DeepPartial } from "@/options/merge";
import {
  type AnyNode,
  type SectionNode,
  schema,
  type TimeValue,
} from "@/options/schema";
import type { Options } from "@/options/storage";
import { DurationField, Group, Switch } from "./components";
import { Status } from "./Status";

type Update = (patch: DeepPartial<Options>) => void;

type Section = { enabled: boolean } & Record<string, unknown>;

const nest = (path: string[], value: unknown) =>
  path.reduceRight<unknown>(
    (inner, key) => ({ [key]: inner }),
    value,
  ) as DeepPartial<Options>;

const count = (node: SectionNode, section: Section) => {
  const switches = Object.entries(node.children).filter(
    ([, child]) => child.kind !== "time",
  );
  const on = switches.filter(([key, child]) =>
    child.kind === "section"
      ? (section[key] as Section).enabled
      : section[key] === true,
  );

  return `${on.length} of ${switches.length} on`;
};

const rows = (
  node: SectionNode,
  section: Section,
  path: string[],
  active: boolean,
  update: Update,
  nested = false,
): React.ReactNode[] =>
  Object.entries(node.children).flatMap(([key, child]) =>
    row(child, section[key], [...path, key], active, update, nested),
  );

const row = (
  node: AnyNode,
  value: unknown,
  path: string[],
  active: boolean,
  update: Update,
  nested: boolean,
): React.ReactNode[] => {
  const id = path.join(".");
  const indent = nested ? "nested" : undefined;

  if (node.kind === "time")
    return [
      <li key={id} className={indent ? `length ${indent}` : "length"}>
        <DurationField
          label={node.label}
          disabled={!active}
          value={value as TimeValue}
          onChange={(length) => update(nest(path, length))}
        />
      </li>,
    ];

  if (node.kind === "bool")
    return [
      <li key={id} className={indent}>
        <Switch
          label={node.label}
          checked={value as boolean}
          disabled={!active}
          onCheckedChange={(checked) => update(nest(path, checked))}
        />
      </li>,
    ];

  const section = value as Section;

  return [
    <li key={id} className={indent}>
      <Switch
        label={node.label}
        checked={section.enabled}
        disabled={!active}
        onCheckedChange={(enabled) =>
          update(nest([...path, "enabled"], enabled))
        }
      />
    </li>,
    ...rows(node, section, path, active && section.enabled, update, true),
  ];
};

export const Groups = ({
  options,
  update,
}: {
  options: Options;
  update: Update;
}) => {
  const [open, setOpen] = useState<string>();

  return Object.entries(schema.children).map(([key, node]) => {
    const section = options[key as keyof typeof schema.children];

    return (
      <Group
        key={key}
        label={node.label}
        checked={section.enabled}
        disabled={!options.enabled}
        open={open === key}
        summary={
          key === "shortVideos" ? (
            <Status options={options} />
          ) : (
            count(node, section)
          )
        }
        onCheckedChange={(enabled) => update(nest([key, "enabled"], enabled))}
        onToggle={() => setOpen(open === key ? undefined : key)}
      >
        {rows(node, section, [key], options.enabled && section.enabled, update)}
      </Group>
    );
  });
};
