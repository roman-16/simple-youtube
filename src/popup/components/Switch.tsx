import { Assign } from "utility-types";

type Props = Assign<
  React.HTMLAttributes<HTMLElement>,
  {
    checked?: boolean;
    label?: React.ReactNode;
    onCheckedChange?: (checked: boolean) => void;
  }
>;

const Switch = ({ checked, label, onCheckedChange, ...props }: Props) => (
  <label
    className="relative flex items-center h-5 w-8 cursor-pointer"
    {...props}
  >
    <input
      type="checkbox"
      className="peer sr-only"
      checked={checked}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
    />

    <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-green-500" />

    <span className="absolute inset-y-0 start-0 m-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:start-3" />

    {label && (
      <div className="ml-10 text-base whitespace-nowrap text-gray-400 peer-checked:text-black">
        {label}
      </div>
    )}
  </label>
);

export default Switch;
