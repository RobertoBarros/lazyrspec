import { test, expect, describe, afterEach } from "bun:test";
import { createTestRenderer } from "@opentui/core/testing";
import { ElapsedTimer, formatElapsed } from "../src/elapsed-timer";

describe("formatElapsed", () => {
  test("shows seconds for less than a minute", () => {
    expect(formatElapsed(0)).toBe("0s ago");
    expect(formatElapsed(5_000)).toBe("5s ago");
    expect(formatElapsed(59_000)).toBe("59s ago");
  });

  test("shows minutes for less than an hour", () => {
    expect(formatElapsed(60_000)).toBe("1m ago");
    expect(formatElapsed(300_000)).toBe("5m ago");
    expect(formatElapsed(3_599_000)).toBe("59m ago");
  });

  test("shows hours for 60 minutes or more", () => {
    expect(formatElapsed(3_600_000)).toBe("1h ago");
    expect(formatElapsed(7_200_000)).toBe("2h ago");
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
    expect(timer.currentContent).toContain("0s ago");
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
    expect(timer.currentContent).toContain("0s ago");
  });

  test("setPrefix updates the prefix", async () => {
    ({ renderer } = await createTestRenderer({ width: 80, height: 10 }));
    timer = new ElapsedTimer(renderer, { prefix: "old" });

    timer.setPrefix("new");
    expect(timer.currentContent).toContain("new");
    expect(timer.currentContent).not.toContain("old");
  });
});
