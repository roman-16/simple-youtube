import { Switch } from "./components";
import { Groups } from "./Groups";
import { Presets } from "./Presets";
import { useOptions } from "./useOptions";

export const App = () => {
  const [options, update] = useOptions();

  if (!options) return null;

  return (
    <main className="popup">
      <header className="top-bar">
        <span className="brand">
          <img className="brand-icon" src="/icons/48.png" alt="" />
          <h1 className="brand-name">Simple YouTube</h1>
        </span>
        <span className="spacer" />
        <Presets options={options} update={update} />
        <Switch
          aria-label="Enabled"
          checked={options.enabled}
          onCheckedChange={(enabled) => update({ enabled })}
        />
      </header>
      <Groups options={options} update={update} />
    </main>
  );
};
