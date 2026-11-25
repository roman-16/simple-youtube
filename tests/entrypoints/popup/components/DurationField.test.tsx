import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DurationField } from "@/entrypoints/popup/components";
import type { TimeValue } from "@/options/schema";

const minute: TimeValue = { hours: 0, minutes: 1, seconds: 0 };

const field = () => screen.getByLabelText<HTMLInputElement>("Maximum length");

const mount = (value = minute) => {
  const onChange = vi.fn();
  const view = render(
    <DurationField label="Maximum length" value={value} onChange={onChange} />,
  );
  const show = (next: TimeValue) =>
    view.rerender(
      <DurationField label="Maximum length" value={next} onChange={onChange} />,
    );

  return { onChange, show };
};

const type = (text: string) =>
  fireEvent.change(field(), { target: { value: text } });

describe("DurationField", () => {
  describe("display", () => {
    it("writes a length as on a thumbnail", () => {
      mount();

      expect(field().value).toBe("1:00");
    });

    it("writes the hours when there are any", () => {
      mount({ hours: 1, minutes: 2, seconds: 3 });

      expect(field().value).toBe("1:02:03");
    });

    it("follows a length changed elsewhere", () => {
      const { show } = mount();

      show({ hours: 0, minutes: 5, seconds: 0 });

      expect(field().value).toBe("5:00");
    });

    it("keeps what is typed while it is saved", () => {
      const { show } = mount();
      type("01:30");

      show({ hours: 0, minutes: 1, seconds: 30 });

      expect(field().value).toBe("01:30");
    });
  });

  describe("typing", () => {
    it("saves a length as soon as it is one", () => {
      const { onChange } = mount();

      type("12:30");

      expect(onChange).toHaveBeenCalledWith({
        hours: 0,
        minutes: 12,
        seconds: 30,
      });
    });

    it("saves nothing while the text is not a length", () => {
      const { onChange } = mount();

      type("12:3");

      expect(onChange).not.toHaveBeenCalled();
      expect(field().value).toBe("12:3");
    });

    it("says nothing about unfinished text", () => {
      mount();

      type("90");

      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  describe("leaving the field", () => {
    it("rewrites a length the way it is shown", () => {
      mount();
      type("90:00");

      fireEvent.blur(field());

      expect(field().value).toBe("1:30:00");
    });

    it("rewrites it on enter as well", () => {
      mount();
      type("01:30");

      fireEvent.keyDown(field(), { key: "Enter" });

      expect(field().value).toBe("1:30");
    });

    it("keeps text that is not a length and says how to write one", () => {
      mount();
      type("90");

      fireEvent.blur(field());

      expect(field().value).toBe("90");
      expect(screen.getByRole("alert").textContent).toBe(
        "Use minutes:seconds, like 1:30",
      );
      expect(field().getAttribute("aria-invalid")).toBe("true");
      expect(field().getAttribute("aria-describedby")).toBe(
        screen.getByRole("alert").id,
      );
    });

    it("drops the remark once the text is a length", () => {
      mount();
      type("90");
      fireEvent.blur(field());

      type("1:30");

      expect(screen.queryByRole("alert")).toBeNull();
    });

    it("drops refused text once the length changes elsewhere", () => {
      const { show } = mount();
      type("90");
      fireEvent.blur(field());

      show({ hours: 0, minutes: 5, seconds: 0 });

      expect(field().value).toBe("5:00");
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  it("dims and locks while disabled", () => {
    render(
      <DurationField
        label="Maximum length"
        disabled
        value={minute}
        onChange={vi.fn()}
      />,
    );

    expect(field().disabled).toBe(true);
    expect(field().closest("label")?.className).toBe("inactive");
  });
});
