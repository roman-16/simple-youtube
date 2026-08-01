import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DomObserver } from "@/entrypoints/content/observer";

const frame = () => new Promise(requestAnimationFrame);

const mutate = () => document.body.append(document.createElement("div"));

const settle = async () => {
  await frame();
  await frame();
};

describe("DomObserver", () => {
  let observer: DomObserver;

  beforeEach(() => {
    observer = new DomObserver();
  });

  afterEach(() => {
    observer.set([]);
  });

  it("runs registered tasks right away", async () => {
    const task = vi.fn();

    observer.set([task]);
    await settle();

    expect(task).toHaveBeenCalledTimes(1);
  });

  it("runs tasks again when the dom changes", async () => {
    const task = vi.fn();
    observer.set([task]);
    await settle();

    mutate();
    await settle();

    expect(task).toHaveBeenCalledTimes(2);
  });

  it("collapses mutations of the same frame into one run", async () => {
    const task = vi.fn();
    observer.set([task]);
    await settle();

    mutate();
    mutate();
    mutate();
    await settle();

    expect(task).toHaveBeenCalledTimes(2);
  });

  it("replaces the previous tasks", async () => {
    const previous = vi.fn();
    const next = vi.fn();
    observer.set([previous]);
    await settle();
    previous.mockClear();

    observer.set([next]);
    mutate();
    await settle();

    expect(previous).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("stops watching without tasks", async () => {
    const task = vi.fn();
    observer.set([task]);
    await settle();
    task.mockClear();

    observer.set([]);
    mutate();
    await settle();

    expect(task).not.toHaveBeenCalled();
  });

  it("watches again after being stopped", async () => {
    const task = vi.fn();
    observer.set([task]);
    await settle();
    observer.set([]);

    observer.set([task]);
    await settle();
    task.mockClear();
    mutate();
    await settle();

    expect(task).toHaveBeenCalledTimes(1);
  });
});
