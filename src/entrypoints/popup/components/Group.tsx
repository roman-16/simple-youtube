import { Icon } from "../icons";
import { Switch } from "./Switch";

type GroupProps = {
  checked: boolean;
  children: React.ReactNode;
  disabled: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
  onToggle: () => void;
  open: boolean;
  summary: React.ReactNode;
};

export const Group = ({
  checked,
  children,
  disabled,
  label,
  onCheckedChange,
  onToggle,
  open,
  summary,
}: GroupProps) => (
  <section className="card group">
    <ul className="list compact">
      <li>
        <button
          type="button"
          className="group-name"
          aria-expanded={open}
          onClick={onToggle}
        >
          <Icon name="caret-right" />
          <span className="list-text">
            <strong>{label}</strong>{" "}
            <small className={disabled || !checked ? "inactive" : undefined}>
              {summary}
            </small>
          </span>
        </button>
        <Switch
          aria-label={label}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
        />
      </li>
      {open && children}
    </ul>
  </section>
);
