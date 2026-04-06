import { test, expect, describe } from "bun:test";
import {
  buildDetail,
  buildOptions,
  buildSummaryText,
  extractJson,
  statusIcon,
  statusColor,
  type RSpecExample,
} from "../src/rspec";

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

const pendingExample: RSpecExample = {
  id: "./spec/calc_spec.rb[1:3:1]",
  description: "multiplies two numbers",
  full_description: "Calculator#multiply multiplies two numbers",
  status: "pending",
  file_path: "./spec/calc_spec.rb",
  line_number: 23,
  run_time: 0.000003,
  pending_message: "Temporarily skipped with xit",
};

describe("buildDetail", () => {
  test("passed example includes status, file and duration", () => {
    const detail = buildDetail(passedExample);
    expect(detail).toContain("Status: PASSED");
    expect(detail).toContain("File: ./spec/calc_spec.rb:7");
    expect(detail).toContain("Duration: 1.23ms");
  });

  test("failed example includes exception info and backtrace", () => {
    const detail = buildDetail(failedExample);
    expect(detail).toContain("Status: FAILED");
    expect(detail).toContain("Error: NameError");
    expect(detail).toContain("undefined local variable 'x'");
    expect(detail).toContain("Backtrace:");
    expect(detail).toContain("Calculator#add");
  });

  test("pending example includes pending message", () => {
    const detail = buildDetail(pendingExample);
    expect(detail).toContain("Status: PENDING");
    expect(detail).toContain("Pending: Temporarily skipped with xit");
  });
});

describe("buildOptions", () => {
  const examples = [passedExample, failedExample, pendingExample];
  const options = buildOptions(examples);

  test("generates correct icon per status", () => {
    expect(options[0]!.name).toStartWith("✓");
    expect(options[1]!.name).toStartWith("✗");
    expect(options[2]!.name).toStartWith("○");
  });

  test("includes full_description in name", () => {
    expect(options[0]!.name).toContain("Calculator#add returns the sum");
    expect(options[1]!.name).toContain("Calculator#subtract returns the difference");
  });

  test("includes file_path:line_number in description", () => {
    expect(options[0]!.description).toBe("./spec/calc_spec.rb:7");
    expect(options[1]!.description).toBe("./spec/calc_spec.rb:15");
    expect(options[2]!.description).toBe("./spec/calc_spec.rb:23");
  });

  test("includes correct color per status", () => {
    expect(options[0]!.value.color).toBe(statusColor.passed);
    expect(options[1]!.value.color).toBe(statusColor.failed);
    expect(options[2]!.value.color).toBe(statusColor.pending);
  });
});

describe("buildSummaryText", () => {
  test("formats summary with counts and duration", () => {
    const summary = {
      duration: 0.00125,
      example_count: 3,
      failure_count: 1,
      pending_count: 1,
      errors_outside_of_examples_count: 0,
    };
    expect(buildSummaryText(summary)).toBe(
      "3 examples, 1 failed, 1 pending (0.001s)",
    );
  });
});

describe("extractJson", () => {
  test("extracts JSON from clean output", () => {
    const json = '{"version":"3.13.6","examples":[]}';
    expect(extractJson(json)).toBe(json);
  });

  test("extracts JSON when preceded by banner text", () => {
    const banner = "*** Notice ***\n* Some warning *\n***************\n\n";
    const json = '{"version":"3.13.6","examples":[]}';
    expect(extractJson(banner + json)).toBe(json);
  });

  test("returns empty string when no JSON present", () => {
    expect(extractJson("no json here")).toBe("");
    expect(extractJson("")).toBe("");
  });
});

