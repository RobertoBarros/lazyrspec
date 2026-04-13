import { readFileSync, existsSync } from "node:fs";

export interface RSpecException {
  class: string;
  message: string;
  backtrace: string[];
}

export interface RSpecExample {
  id: string;
  description: string;
  full_description: string;
  status: "passed" | "failed" | "pending";
  file_path: string;
  line_number: number;
  run_time: number;
  pending_message: string | null;
  exception?: RSpecException;
}

export interface RSpecResult {
  version: string;
  examples: RSpecExample[];
  summary: {
    duration: number;
    example_count: number;
    failure_count: number;
    pending_count: number;
    errors_outside_of_examples_count: number;
  };
  summary_line: string;
}

export const statusIcon: Record<string, string> = {
  passed: "✓",
  failed: "✗",
  pending: "○",
};

export const statusColor: Record<string, string> = {
  passed: "#22cc22",
  failed: "#ff4444",
  pending: "#ffaa00",
};

export function checkRspecInstalled(): void {
  if (existsSync("Gemfile.lock")) {
    const content = readFileSync("Gemfile.lock", "utf-8");
    if (content.includes("rspec-core")) return;

    console.error("rspec-core not found in Gemfile.lock.");
    console.error("Add it with: bundle add rspec");
    process.exit(1);
  }

  if (existsSync("Gemfile")) {
    const content = readFileSync("Gemfile", "utf-8");
    if (content.includes("rspec")) {
      console.error("rspec found in Gemfile but Gemfile.lock is missing.");
      console.error("Run: bundle install");
      process.exit(1);
    }
  }

  const which = Bun.spawnSync(["which", "rspec"], { stdout: "pipe", stderr: "pipe" });
  if (which.exitCode === 0) return;

  console.error("rspec is not installed.");
  console.error("Install it with: gem install rspec");
  process.exit(1);
}

function emptyResult(): RSpecResult {
  return {
    version: "0",
    examples: [],
    summary: {
      duration: 0,
      example_count: 0,
      failure_count: 0,
      pending_count: 0,
      errors_outside_of_examples_count: 0,
    },
    summary_line: "",
  };
}

// rspec --format json sends JSON to stdout, but gems, plugins or project
// configurations can print banners or notices to stdout before the JSON.
// JSON.parse() fails when the output contains text before the opening '{'.
// This function extracts only the JSON portion of the output.
export function extractJson(output: string): string {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");
  if (start === -1 || end === -1) return "";
  return output.substring(start, end + 1);
}

export function runRspec(specPath: string): RSpecResult {
  const proc = Bun.spawnSync(["rspec", specPath, "--format", "json"], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const output = proc.stdout.toString().trim();
  const stderr = proc.stderr.toString();

  try {
    return JSON.parse(extractJson(output));
  } catch {
    const missingRspec =
      stderr.includes("Gem::GemNotFoundException") ||
      stderr.includes("can't find gem rspec-core") ||
      stderr.includes("command not found");
    const missingSpec =
      stderr.includes("No such file or directory") ||
      stderr.includes("cannot load such file");

    if (!output && (missingRspec || missingSpec)) {
      return emptyResult();
    }

    console.error("Failed to parse RSpec output. Is rspec installed?");
    console.error(stderr);
    process.exit(1);
  }
}

export function buildDetail(ex: RSpecExample): string {
  const lines: string[] = [];
  lines.push(`Status: ${ex.status.toUpperCase()}`);
  lines.push(`File: ${ex.file_path}:${ex.line_number}`);
  lines.push(`Duration: ${(ex.run_time * 1000).toFixed(2)}ms`);

  if (ex.pending_message) {
    lines.push(`\nPending: ${ex.pending_message}`);
  }

  if (ex.exception) {
    lines.push(`\nError: ${ex.exception.class}`);
    lines.push(ex.exception.message);
    lines.push(`\nBacktrace:`);
    for (const line of ex.exception.backtrace) {
      lines.push(`  ${line}`);
    }
  }

  return lines.join("\n");
}

export interface TestOption {
  name: string;
  description: string;
  value: { detail: string; color: string };
}

export function buildOptions(examples: RSpecExample[]): TestOption[] {
  return examples.map((ex) => {
    const icon = statusIcon[ex.status] || "?";
    return {
      name: `${icon} ${ex.full_description}`,
      description: `${ex.file_path}:${ex.line_number}`,
      value: { detail: buildDetail(ex), color: statusColor[ex.status] || "#aaaaaa" },
    };
  });
}

export function buildSummaryText(summary: RSpecResult["summary"]): string {
  return `${summary.example_count} examples, ${summary.failure_count} failed, ${summary.pending_count} pending (${summary.duration.toFixed(3)}s)`;
}
