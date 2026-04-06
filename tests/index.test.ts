import { test, expect, describe } from "bun:test";

describe("index.ts", () => {
  test("exits gracefully when no examples found", () => {
    const proc = Bun.spawnSync(["bun", "src/index.ts", "nonexistent_spec.rb"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = proc.stdout.toString();
    expect(proc.exitCode).toBe(0);
    expect(stdout).toContain("No examples found.");
  });

  test("starts without crashing with valid spec path", async () => {
    const proc = Bun.spawn(["bun", "src/index.ts", "spec/calculator_spec.rb"], {
      stdout: "pipe",
      stderr: "pipe",
      env: { ...process.env, TERM: "dumb" },
    });

    // Give it time to boot, then kill it
    await Bun.sleep(2000);
    proc.kill();
    await proc.exited;

    const stderr = await new Response(proc.stderr).text();
    expect(stderr).not.toContain("Failed to parse RSpec output");
  });
});
