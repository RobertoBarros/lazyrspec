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

export function runRspec(specPath: string): RSpecResult {
  const proc = Bun.spawnSync(["rspec", specPath, "--format", "json"], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const output = proc.stdout.toString();
  try {
    return JSON.parse(output);
  } catch {
    console.error("Failed to parse RSpec output. Is rspec installed?");
    console.error(proc.stderr.toString());
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

