import { existsSync, readFileSync } from "node:fs";
import { extractJson } from "./rspec";
import type { ColoredSelectOption } from "./colored-select";

export interface RubocopOffense {
  severity: "convention" | "warning" | "error" | "fatal" | "refactor" | "info";
  message: string;
  cop_name: string;
  corrected: boolean;
  correctable: boolean;
  location: { line: number; column: number; length: number };
}

export interface RubocopFile {
  path: string;
  offenses: RubocopOffense[];
}

export interface RubocopSummary {
  offense_count: number;
  target_file_count: number;
  inspected_file_count: number;
}

export interface RubocopResult {
  files: RubocopFile[];
  summary: RubocopSummary;
}

export interface RubocopOffenseEntry {
  filePath: string;
  offense: RubocopOffense;
}

export const severityColor: Record<string, string> = {
  error: "#ff4444",
  fatal: "#ff2222",
  warning: "#ffaa00",
  convention: "#5599ff",
  refactor: "#aa88ff",
  info: "#888888",
};

export const severityIcon: Record<string, string> = {
  error: "✗",
  fatal: "✗",
  warning: "⚠",
  convention: "○",
  refactor: "↺",
  info: "ℹ",
};

function emptyResult(): RubocopResult {
  return {
    files: [],
    summary: { offense_count: 0, target_file_count: 0, inspected_file_count: 0 },
  };
}

export function checkRubocopInstalled(): boolean {
  if (existsSync("Gemfile.lock")) {
    const content = readFileSync("Gemfile.lock", "utf-8");
    return content.includes("rubocop");
  }

  const which = Bun.spawnSync(["which", "rubocop"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  return which.exitCode === 0;
}

export function runRubocop(targetPath: string): RubocopResult {
  const proc = Bun.spawnSync(
    ["rubocop", targetPath, "--format", "json", "--no-color"],
    { stdout: "pipe", stderr: "pipe" },
  );

  const output = proc.stdout.toString().trim();

  try {
    return JSON.parse(extractJson(output));
  } catch {
    return emptyResult();
  }
}

export function flattenOffenses(result: RubocopResult): RubocopOffenseEntry[] {
  const entries: RubocopOffenseEntry[] = [];
  for (const file of result.files) {
    for (const offense of file.offenses) {
      entries.push({ filePath: file.path, offense });
    }
  }
  return entries;
}

export function buildRubocopDetail(entry: RubocopOffenseEntry): string {
  const { offense, filePath } = entry;
  const lines: string[] = [];
  lines.push(`Severity: ${offense.severity.toUpperCase()}`);
  lines.push(`Cop: ${offense.cop_name}`);
  lines.push(`File: ${filePath}:${offense.location.line}:${offense.location.column}`);
  lines.push(`\nMessage: ${offense.message}`);
  if (offense.correctable) {
    lines.push(
      `\nAuto-correctable: ${offense.corrected ? "already corrected" : "yes (run rubocop -a)"}`,
    );
  }
  return lines.join("\n");
}

export function buildRubocopOptions(
  entries: RubocopOffenseEntry[],
): ColoredSelectOption[] {
  return entries.map((entry) => {
    const icon = severityIcon[entry.offense.severity] || "?";
    const color = severityColor[entry.offense.severity] || "#aaaaaa";
    return {
      name: `${icon} ${entry.offense.cop_name}: ${entry.offense.message}`,
      description: `${entry.filePath}:${entry.offense.location.line}:${entry.offense.location.column}`,
      value: {
        detail: buildRubocopDetail(entry),
        color,
      },
    };
  });
}

export function buildRubocopSummaryText(summary: RubocopSummary): string {
  return `${summary.offense_count} offenses in ${summary.inspected_file_count} files`;
}
