import { TextRenderable, type ColorInput } from "@opentui/core";
import type { RenderContext } from "@opentui/core";

function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 30) return "updated less than 30 seconds ago";
  if (seconds < 60) return "updated less than a minute ago";
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "updated 1 minute ago";
  if (minutes < 60) return `updated ${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "updated 1 hour ago";
  return `updated ${hours} hours ago`;
}

export interface ElapsedTimerOptions {
  prefix: string;
  fg?: ColorInput;
  intervalMs?: number;
}

export class ElapsedTimer {
  readonly text: TextRenderable;
  private prefix: string;
  private lastRunAt: number;
  private interval: ReturnType<typeof setInterval>;

  constructor(ctx: RenderContext, opts: ElapsedTimerOptions) {
    this.prefix = opts.prefix;
    this.lastRunAt = Date.now();

    this.text = new TextRenderable(ctx, {
      content: "",
      fg: opts.fg || "#888888",
      wrapMode: "none",
      truncate: true,
    });

    this.update();
    this.interval = setInterval(() => this.update(), opts.intervalMs ?? 1000);
  }

  reset() {
    this.lastRunAt = Date.now();
    this.update();
  }

  showMessage(message: string) {
    this.applyContent(message);
  }

  private update() {
    const elapsed = formatElapsed(Date.now() - this.lastRunAt);
    this.applyContent(this.buildElapsedMessage(elapsed));
  }

  private buildElapsedMessage(elapsed: string) {
    return `${this.prefix}  (${elapsed})`;
  }

  private applyContent(content: string) {
    this.text.content = content;
  }

  destroy() {
    clearInterval(this.interval);
  }
}

export { formatElapsed };
