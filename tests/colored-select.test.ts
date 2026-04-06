import { test, expect, describe } from "bun:test";
import { createTestRenderer } from "@opentui/core/testing";
import { BoxRenderable } from "@opentui/core";
import { createColoredSelect } from "../src/colored-select";

async function setup() {
  const { renderer, mockInput, renderOnce, captureCharFrame } =
    await createTestRenderer({ width: 60, height: 20 });

  const root = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
  });

  const select = createColoredSelect(renderer, {
    width: "100%",
    height: "100%",
    options: [
      { name: "✓ test passed", description: "spec.rb:1", value: { detail: "ok", color: "#22cc22" } },
      { name: "✗ test failed", description: "spec.rb:5", value: { detail: "err", color: "#ff4444" } },
      { name: "○ test pending", description: "spec.rb:9", value: { detail: "skip", color: "#ffaa00" } },
    ],
    selectedIndex: 0,
    backgroundColor: "transparent",
    selectedBackgroundColor: "#334455",
    textColor: "#aaaaaa",
    showDescription: true,
  });

  root.add(select);
  renderer.root.add(root);
  select.focus();

  return { renderer, mockInput, renderOnce, captureCharFrame, select };
}

describe("createColoredSelect", () => {
  test("renders all options", async () => {
    const { renderOnce, captureCharFrame, renderer } = await setup();
    await renderOnce();
    const frame = captureCharFrame();

    expect(frame).toContain("test passed");
    expect(frame).toContain("test failed");
    expect(frame).toContain("test pending");

    renderer.destroy();
  });

  test("navigates down with arrow key", async () => {
    const { renderOnce, mockInput, select, renderer } = await setup();
    await renderOnce();

    expect(select.getSelectedIndex()).toBe(0);

    mockInput.pressArrow("down");
    await renderOnce();

    expect(select.getSelectedIndex()).toBe(1);

    renderer.destroy();
  });

  test("updates options dynamically", async () => {
    const { renderOnce, captureCharFrame, select, renderer } = await setup();
    await renderOnce();

    select.options = [
      { name: "✓ new test", description: "new.rb:1", value: { detail: "ok", color: "#22cc22" } },
    ] as any;

    await renderOnce();
    const frame = captureCharFrame();

    expect(frame).toContain("new test");
    expect(frame).not.toContain("test failed");

    renderer.destroy();
  });
});
