import { useEffect, useId, useState } from "react";
import type { TimeValue } from "@/options/schema";
import { formatDuration, parseDuration } from "../duration";

type DurationFieldProps = {
  disabled?: boolean;
  label: string;
  onChange: (value: TimeValue) => void;
  value: TimeValue;
};

export const DurationField = ({
  disabled,
  label,
  onChange,
  value,
}: DurationFieldProps) => {
  const saved = formatDuration(value);
  const [text, setText] = useState(saved);
  const [flagged, setFlagged] = useState(false);
  const problem = useId();

  useEffect(() => {
    setText((current) => {
      const typed = parseDuration(current);

      return typed && formatDuration(typed) === saved ? current : saved;
    });
  }, [saved]);

  const typed = parseDuration(text);
  const refused = flagged && !typed;

  const type = (next: string) => {
    setText(next);

    const length = parseDuration(next);
    if (length) onChange(length);
  };

  const settle = () => {
    setFlagged(!typed);
    if (typed) setText(formatDuration(typed));
  };

  return (
    <>
      <label className={disabled ? "inactive" : undefined}>
        {label}
        <input
          className="field small short"
          aria-describedby={refused ? problem : undefined}
          aria-invalid={refused}
          autoComplete="off"
          disabled={disabled}
          spellCheck={false}
          value={text}
          onBlur={settle}
          onChange={(event) => type(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") settle();
          }}
        />
      </label>
      {refused && (
        <p className="problem" id={problem} role="alert">
          Use minutes:seconds, like 1:30
        </p>
      )}
    </>
  );
};
