type Task = () => void;

export class DomObserver {
  private observer?: MutationObserver;
  private queued = false;
  private tasks = new Set<Task>();

  set(tasks: Task[]) {
    this.tasks = new Set(tasks);

    if (this.tasks.size === 0) {
      this.stop();
      return;
    }

    if (!this.observer) this.observe();
    this.schedule();
  }

  private observe() {
    const target = document.body;

    if (!target) {
      requestAnimationFrame(() => this.observe());
      return;
    }

    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(target, { childList: true, subtree: true });
  }

  private schedule() {
    if (this.queued || this.tasks.size === 0) return;

    this.queued = true;
    requestAnimationFrame(() => {
      this.queued = false;
      for (const task of this.tasks) task();
    });
  }

  private stop() {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
