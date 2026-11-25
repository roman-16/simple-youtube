import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "../icons";

type MenuItem = { icon: IconName; label: string; onSelect: () => void };

type MenuProps = { icon: IconName; items: MenuItem[]; label: string };

const STEPS: Record<string, (index: number, count: number) => number> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  End: (_index, count) => count - 1,
  Home: () => 0,
};

const entries = (menu: HTMLElement | null) =>
  Array.from(menu?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);

export const Menu = ({ icon, items, label }: MenuProps) => {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    entries(menu.current)[0]?.focus();

    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menu.current?.contains(target) || button.current?.contains(target))
        return;

      setOpen(false);
    };

    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };

  const navigate = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }

    const step = STEPS[event.key];
    if (!step) return;

    event.preventDefault();
    const all = entries(menu.current);
    const current = all.indexOf(document.activeElement as HTMLElement);
    all[step(current, all.length)]?.focus();
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        className="icon-button small"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        title={label}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;

          event.preventDefault();
          setOpen(true);
        }}
      >
        <Icon name={icon} />
      </button>
      {open && (
        <div
          ref={menu}
          className="menu"
          role="menu"
          aria-label={label}
          onKeyDown={navigate}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              className="menu-item"
              role="menuitem"
              tabIndex={-1}
              onClick={() => {
                close();
                item.onSelect();
              }}
            >
              <Icon name={item.icon} />
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
