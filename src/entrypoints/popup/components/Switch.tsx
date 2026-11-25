type SwitchProps = {
  "aria-label"?: string;
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onCheckedChange: (checked: boolean) => void;
};

export const Switch = ({
  "aria-label": ariaLabel,
  checked,
  disabled,
  label,
  onCheckedChange,
}: SwitchProps) => (
  <label className="switch">
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={checked}
      disabled={disabled}
      onChange={(event) => onCheckedChange(event.target.checked)}
    />
    <span className="slider" />
    {label && <span className="switch-label">{label}</span>}
  </label>
);
