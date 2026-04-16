import { afterEach, describe, expect, test } from "bun:test";
import { createTestRenderer } from "@opentui/core/testing";
import { buildOptions, type RSpecExample } from "../src/rspec";
import { createAppWindows } from "../src/windows";

const passedExample: RSpecExample = {
  id: "./spec/calc_spec.rb[1:1:1]",
  description: "returns the sum",
  full_description: "Calculator#add returns the sum",
  status: "passed",
  file_path: "./spec/calc_spec.rb",
  line_number: 7,
  run_time: 0.001234,
  pending_message: null,
};

const failedExample: RSpecExample = {
  id: "./spec/calc_spec.rb[1:2:1]",
  description: "returns the difference",
  full_description: "Calculator#subtract returns the difference",
  status: "failed",
  file_path: "./spec/calc_spec.rb",
  line_number: 15,
  run_time: 0.000512,
  pending_message: null,
  exception: {
    class: "NameError",
    message: "undefined local variable 'x'",
    backtrace: [
      "./spec/calculator.rb:3:in 'Calculator#add'",
      "./spec/calc_spec.rb:9:in 'block (3 levels)'",
    ],
  },
};

describe("createAppWindows", () => {
  let renderer: Awaited<ReturnType<typeof createTestRenderer>>["renderer"];
  let mockInput: Awaited<ReturnType<typeof createTestRenderer>>["mockInput"];
  let renderOnce: Awaited<ReturnType<typeof createTestRenderer>>["renderOnce"];
  let captureCharFrame: Awaited<
    ReturnType<typeof createTestRenderer>
  >["captureCharFrame"];
  let elapsed: { destroy(): void } | undefined;

  async function setup() {
    const testRenderer = await createTestRenderer({ width: 100, height: 24 });
    renderer = testRenderer.renderer;
    mockInput = testRenderer.mockInput;
    renderOnce = testRenderer.renderOnce;
    captureCharFrame = testRenderer.captureCharFrame;

    const examples = [passedExample, failedExample];
    const options = buildOptions(examples);
    const windows = await createAppWindows({ renderer });

    elapsed = windows.elapsed;

    return { windows, examples, options };
  }

  afterEach(() => {
    elapsed?.destroy();
    renderer?.destroy();
  });

  test("updates the tests panel title from summary text", async () => {
    const { windows } = await setup();

    windows.updateSummary("2 examples");
    await renderOnce();

    expect(captureCharFrame()).toContain("1. RSpec (2 examples)");
  });

  test("updates the details panel when the selected option changes", async () => {
    const { windows, examples, options } = await setup();

    windows.setVisibleOptions(examples, options);
    await renderOnce();

    mockInput.pressArrow("down");
    await renderOnce();

    const frame = captureCharFrame();
    expect(frame).toContain("Calculator#subtract returns the difference");
    expect(frame).toContain("Error: NameError");
  });

  test("renders an empty state when no examples match the filter", async () => {
    const { windows } = await setup();

    windows.setVisibleOptions([], []);
    await renderOnce();

    const frame = captureCharFrame();
    expect(frame).toContain("No tests to display");
    expect(frame).toContain("No examples match the current filter.");
  });
});
