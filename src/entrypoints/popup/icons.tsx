import arrowCounterClockwise from "@phosphor-icons/core/regular/arrow-counter-clockwise.svg?raw";
import caretRight from "@phosphor-icons/core/regular/caret-right.svg?raw";
import checks from "@phosphor-icons/core/regular/checks.svg?raw";
import dotsThree from "@phosphor-icons/core/regular/dots-three.svg?raw";
import x from "@phosphor-icons/core/regular/x.svg?raw";

const ICONS = {
  "arrow-counter-clockwise": arrowCounterClockwise,
  "caret-right": caretRight,
  checks,
  "dots-three": dotsThree,
  x,
};

export type IconName = keyof typeof ICONS;

const path = (svg: string) => /<path d="([^"]+)"/.exec(svg)?.[1] ?? "";

export const Icon = ({ name }: { name: IconName }) => (
  <svg className="icon" viewBox="0 0 256 256" aria-hidden="true">
    <path d={path(ICONS[name])} />
  </svg>
);
