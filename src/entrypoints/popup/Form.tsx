import { Fragment } from "react";
import type { DeepPartial } from "@/options/merge";
import { type AnyNode, schema, type TimeValue } from "@/options/schema";
import type { Options } from "@/options/storage";
import { Section, Switch, TimeInput } from "./components";

type Update = (patch: DeepPartial<Options>) => void;

const nest = (path: string[], value: unknown): Record<string, unknown> =>
  path.reduceRight<Record<string, unknown>>(
    (accumulator, key) => ({ [key]: accumulator }),
    value as Record<string, unknown>,
  );

const renderNode = (
  key: string,
  node: AnyNode,
  value: unknown,
  path: string[],
  update: Update,
) => {
  const here = [...path, key];
  const patch = (target: string[], next: unknown) =>
    update(nest(target, next) as DeepPartial<Options>);

  if (node.kind === "bool")
    return (
      <Switch
        key={key}
        label={node.label}
        checked={value as boolean}
        onCheckedChange={(checked) => patch(here, checked)}
      />
    );

  if (node.kind === "time") {
    const time = value as TimeValue;
    return (
      <div key={key} className="ml-6 flex gap-1">
        {node.label}
        <TimeInput
          hours={time.hours}
          minutes={time.minutes}
          seconds={time.seconds}
          onHoursChange={(hours) => patch(here, { hours })}
          onMinutesChange={(minutes) => patch(here, { minutes })}
          onSecondsChange={(seconds) => patch(here, { seconds })}
        />
      </div>
    );
  }

  const section = value as { enabled: boolean } & Record<string, unknown>;
  return (
    <Fragment key={key}>
      <Switch
        label={node.label}
        checked={section.enabled}
        onCheckedChange={(checked) => patch([...here, "enabled"], checked)}
      />
      {section.enabled && (
        <Section>
          {Object.entries(node.children).map(([childKey, child]) =>
            renderNode(childKey, child, section[childKey], here, update),
          )}
        </Section>
      )}
    </Fragment>
  );
};

export const Form = ({
  options,
  update,
}: {
  options: Options;
  update: Update;
}) => (
  <div className="flex flex-col gap-2">
    <Switch
      label="Enabled"
      checked={options.enabled}
      onCheckedChange={(checked) => update({ enabled: checked })}
    />
    {options.enabled && (
      <Section>
        {Object.entries(schema.children).map(([key, child]) =>
          renderNode(
            key,
            child,
            (options as unknown as Record<string, unknown>)[key],
            [],
            update,
          ),
        )}
      </Section>
    )}
  </div>
);
