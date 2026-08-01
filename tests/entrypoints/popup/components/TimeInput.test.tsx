import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TimeInput } from "@/entrypoints/popup/components";

const fields = () => screen.getAllByRole<HTMLInputElement>("textbox");

const type = (index: number, value: string) => {
  const field = fields()[index];
  if (!field) throw new Error(`missing field ${index}`);

  fireEvent.change(field, { target: { value } });
};

const handlers = () => {
  const onHoursChange = vi.fn();
  const onMinutesChange = vi.fn();
  const onSecondsChange = vi.fn();

  render(
    <TimeInput
      hours={0}
      minutes={1}
      seconds={0}
      onHoursChange={onHoursChange}
      onMinutesChange={onMinutesChange}
      onSecondsChange={onSecondsChange}
    />,
  );

  return { onHoursChange, onMinutesChange, onSecondsChange };
};

describe("TimeInput", () => {
  describe("display", () => {
    it("pads every unit to two digits", () => {
      render(<TimeInput hours={1} minutes={2} seconds={3} />);

      expect(fields().map((field) => field.value)).toEqual(["01", "02", "03"]);
    });

    it("shows zeroes without a value", () => {
      render(<TimeInput />);

      expect(fields().map((field) => field.value)).toEqual(["00", "00", "00"]);
    });

    it("keeps long durations intact", () => {
      render(<TimeInput hours={100} minutes={59} seconds={59} />);

      expect(fields().map((field) => field.value)).toEqual(["100", "59", "59"]);
    });
  });

  describe("input", () => {
    it("reports each unit separately", () => {
      const { onHoursChange, onMinutesChange, onSecondsChange } = handlers();

      type(1, "5");

      expect(onMinutesChange).toHaveBeenCalledWith(5);
      expect(onHoursChange).not.toHaveBeenCalled();
      expect(onSecondsChange).not.toHaveBeenCalled();
    });

    it("caps minutes and seconds at 59", () => {
      const { onMinutesChange, onSecondsChange } = handlers();

      type(1, "90");
      type(2, "90");

      expect(onMinutesChange).toHaveBeenCalledWith(59);
      expect(onSecondsChange).toHaveBeenCalledWith(59);
    });

    it("leaves hours uncapped", () => {
      const { onHoursChange } = handlers();

      type(0, "100");

      expect(onHoursChange).toHaveBeenCalledWith(100);
    });

    it.each(["-5", "abc", ""])("falls back to zero for %s", (value) => {
      const { onMinutesChange } = handlers();

      type(1, value);

      expect(onMinutesChange).toHaveBeenCalledWith(0);
    });
  });
});
