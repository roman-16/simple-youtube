import _ from "lodash-es";
import { Assign } from "utility-types";

const parseNumber = (value: string, min = 0, max?: number) => {
  const number = Number(value);

  if (Number.isNaN(number)) return min;
  if (number < min) return min;
  if (typeof max === "number" && number > max) return max;

  return number;
};

type Props = Assign<
  React.HTMLAttributes<HTMLElement>,
  {
    hours?: number;
    minutes?: number;
    seconds?: number;
    onHoursChange?: (hours: number) => void;
    onMinutesChange?: (minutes: number) => void;
    onSecondsChange?: (seconds: number) => void;
  }
>;

const TimeInput = ({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  ...props
}: Props) => (
  <div className="text-base" {...props}>
    <input
      className="w-[22px] text-right border rounded-none border-gray-400"
      value={_.padStart(hours?.toString(), 2, "0")}
      onChange={(event) => onHoursChange?.(parseNumber(event.target.value, 0))}
    />
    :
    <input
      className="w-[22px] text-right border rounded-none border-gray-400"
      value={_.padStart(minutes?.toString(), 2, "0")}
      onChange={(event) =>
        onMinutesChange?.(parseNumber(event.target.value, 0, 59))
      }
    />
    :
    <input
      className="w-[22px] border rounded-none border-gray-400"
      value={_.padStart(seconds?.toString(), 2, "0")}
      onChange={(event) =>
        onSecondsChange?.(parseNumber(event.target.value, 0, 59))
      }
    />
  </div>
);

export default TimeInput;
