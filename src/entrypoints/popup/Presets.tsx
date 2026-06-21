import type { DeepPartial } from "@/options/merge";
import { presets } from "@/options/presets";
import type { Options } from "@/options/storage";
import { Button } from "./components";

export const Presets = ({
  update,
}: {
  update: (patch: DeepPartial<Options>) => void;
}) => (
  <div>
    <div className="mb-1 text-lg">Set configuration to</div>
    <div className="flex gap-2 text-sm">
      {presets.map((preset) => (
        <Button key={preset.name} onClick={() => update(preset.options)}>
          {preset.name}
        </Button>
      ))}
    </div>
  </div>
);
