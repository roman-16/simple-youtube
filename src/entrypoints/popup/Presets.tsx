import { useEffect, useState } from "react";
import { type DeepPartial, deepEqual, deepMerge } from "@/options/merge";
import { type Preset, presets } from "@/options/presets";
import type { Options } from "@/options/storage";
import { Menu, Snackbar } from "./components";
import type { IconName } from "./icons";

const ICONS: Record<Preset["id"], IconName> = {
  all: "checks",
  none: "x",
  recommended: "arrow-counter-clockwise",
};

const UNDO_MS = 8000;

type Offer = { applied: Options; previous: Options; receipt: string };

export const Presets = ({
  options,
  update,
}: {
  options: Options;
  update: (patch: DeepPartial<Options>) => void;
}) => {
  const [offer, setOffer] = useState<Offer>();

  useEffect(() => {
    if (!offer) return;

    const timer = setTimeout(() => setOffer(undefined), UNDO_MS);
    return () => clearTimeout(timer);
  }, [offer]);

  useEffect(() => {
    setOffer((current) =>
      current &&
      !deepEqual(options, current.applied) &&
      !deepEqual(options, current.previous)
        ? undefined
        : current,
    );
  }, [options]);

  const apply = (preset: Preset) => {
    const applied = deepMerge(options, preset.options);
    if (deepEqual(applied, options)) return;

    update(preset.options);
    setOffer({ applied, previous: options, receipt: preset.receipt });
  };

  const undo = (previous: Options) => {
    update(previous);
    setOffer(undefined);
  };

  return (
    <>
      <Menu
        icon="dots-three"
        label="Presets"
        items={presets.map((preset) => ({
          icon: ICONS[preset.id],
          label: preset.label,
          onSelect: () => apply(preset),
        }))}
      />
      <div className="snackbars" role="status">
        {offer && (
          <Snackbar action="Undo" onAction={() => undo(offer.previous)}>
            {offer.receipt}
          </Snackbar>
        )}
      </div>
    </>
  );
};
