import { test, expect, describe, afterEach } from "bun:test";
import { createTestRenderer } from "@opentui/core/testing";
import { ElapsedTimer, formatElapsed } from "../src/elapsed-timer";

describe("formatElapsed", () => {
  test("less than 30 seconds", () => {
    expect(formatElapsed(0)).toBe("updated less than 30 seconds ago");
    expect(formatElapsed(15_000)).toBe("updated less than 30 seconds ago");
    expect(formatElapsed(29_000)).toBe("updated less than 30 seconds ago");
  });

  test("less than a minute", () => {
    expect(formatElapsed(30_000)).toBe("updated less than a minute ago");
    expect(formatElapsed(45_000)).toBe("updated less than a minute ago");
    expect(formatElapsed(59_000)).toBe("updated less than a minute ago");
  });

  test("minutes", () => {
    expect(formatElapsed(60_000)).toBe("updated 1 minute ago");
    expect(formatElapsed(120_000)).toBe("updated 2 minutes ago");
    expect(formatElapsed(300_000)).toBe("updated 5 minutes ago");
    expect(formatElapsed(3_599_000)).toBe("updated 59 minutes ago");
  });

  test("hours", () => {
    expect(formatElapsed(3_600_000)).toBe("updated 1 hour ago");
    expect(formatElapsed(7_200_000)).toBe("updated 2 hours ago");
  });
});

describe("ElapsedTimer", () => {
  let renderer: Awaited<ReturnType<typeof createTestRenderer>>["renderer"];
  let timer: ElapsedTimer;

  afterEach(() => {
    timer?.destroy();
    renderer?.destroy();
  });

  test("initializes with prefix and elapsed time", async () => {
    ({ renderer } = await createTestRenderer({ width: 80, height: 10 }));
    timer = new ElapsedTimer(renderer, { prefix: "keys" });

    expect(timer.currentContent).toContain("keys");
    expect(timer.currentContent).toContain("updated less than 30 seconds ago");
  });

  test("showMessage replaces content temporarily", async () => {
    ({ renderer } = await createTestRenderer({ width: 80, height: 10 }));
    timer = new ElapsedTimer(renderer, { prefix: "keys" });

    timer.showMessage("Loading...");
    expect(timer.currentContent).toBe("Loading...");
  });

  test("reset restores prefix with fresh elapsed time", async () => {
    ({ renderer } = await createTestRenderer({ width: 80, height: 10 }));
    timer = new ElapsedTimer(renderer, { prefix: "keys" });

    timer.showMessage("Loading...");
    timer.reset();

    expect(timer.currentContent).toContain("keys");
    expect(timer.currentContent).toContain("updated less than 30 seconds ago");
  });

  test("setPrefix updates the prefix", async () => {
    ({ renderer } = await createTestRenderer({ width: 80, height: 10 }));
    timer = new ElapsedTimer(renderer, { prefix: "old" });

    timer.setPrefix("new");
    expect(timer.currentContent).toContain("new");
    expect(timer.currentContent).not.toContain("old");
  });
});
