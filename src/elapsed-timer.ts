import { TextRenderable, type ColorInput } from "@opentui/core";
import type { RenderContext } from "@opentui/core";

function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
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
  private _currentContent: string = "";

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

  setPrefix(prefix: string) {
    this.prefix = prefix;
    this.update();
  }

  get currentContent(): string {
    return this._currentContent;
  }

  showMessage(message: string) {
    this._currentContent = message;
    this.text.content = message;
  }

  private update() {
    const elapsed = formatElapsed(Date.now() - this.lastRunAt);
    this._currentContent = `${this.prefix}  (${elapsed})`;
    this.text.content = this._currentContent;
  }

  destroy() {
    clearInterval(this.interval);
  }
}

export { formatElapsed };
