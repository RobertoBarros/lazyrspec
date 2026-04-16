import { test, expect, describe } from "bun:test";
import {
  buildRubocopDetail,
  buildRubocopOptions,
  buildRubocopSummaryText,
  flattenOffenses,
  severityColor,
  severityIcon,
  type RubocopOffenseEntry,
  type RubocopResult,
} from "../src/rubocop";

const conventionOffense: RubocopOffenseEntry = {
  filePath: "./app/models/user.rb",
  offense: {
    severity: "convention",
    message: "Line is too long. [105/80]",
    cop_name: "Layout/LineLength",
    corrected: false,
    correctable: false,
    location: { line: 12, column: 1, length: 105 },
  },
};

const errorOffense: RubocopOffenseEntry = {
  filePath: "./app/controllers/users_controller.rb",
  offense: {
    severity: "error",
    message: "Syntax error, unexpected end-of-input",
    cop_name: "Lint/Syntax",
    corrected: false,
    correctable: false,
    location: { line: 45, column: 3, length: 1 },
  },
};

const correctableOffense: RubocopOffenseEntry = {
  filePath: "./app/models/order.rb",
  offense: {
    severity: "warning",
    message: "Useless assignment to variable - `x`.",
    cop_name: "Lint/UselessAssignment",
    corrected: false,
    correctable: true,
    location: { line: 7, column: 5, length: 1 },
  },
};

describe("buildRubocopDetail", () => {
  test("convention offense includes severity, cop, file:line and message", () => {
    const detail = buildRubocopDetail(conventionOffense);
    expect(detail).toContain("Severity: CONVENTION");
    expect(detail).toContain("Cop: Layout/LineLength");
    expect(detail).toContain("File: ./app/models/user.rb:12:1");
    expect(detail).toContain("Message: Line is too long. [105/80]");
  });

  test("error offense shows severity uppercased", () => {
    const detail = buildRubocopDetail(errorOffense);
    expect(detail).toContain("Severity: ERROR");
    expect(detail).toContain("Cop: Lint/Syntax");
    expect(detail).toContain("File: ./app/controllers/users_controller.rb:45:3");
  });

  test("correctable offense mentions rubocop -a", () => {
    const detail = buildRubocopDetail(correctableOffense);
    expect(detail).toContain("rubocop -a");
  });

  test("non-correctable offense does not mention correctable", () => {
    const detail = buildRubocopDetail(conventionOffense);
    expect(detail).not.toContain("Auto-correctable");
  });
});

describe("buildRubocopOptions", () => {
  const options = buildRubocopOptions([conventionOffense, errorOffense, correctableOffense]);

  test("generates correct icon per severity", () => {
    expect(options[0]!.name).toStartWith(severityIcon.convention!);
    expect(options[1]!.name).toStartWith(severityIcon.error!);
    expect(options[2]!.name).toStartWith(severityIcon.warning!);
  });

  test("name includes cop_name and message", () => {
    expect(options[0]!.name).toContain("Layout/LineLength");
    expect(options[0]!.name).toContain("Line is too long. [105/80]");
    expect(options[1]!.name).toContain("Lint/Syntax");
  });

  test("description is filePath:line:column", () => {
    expect(options[0]!.description).toBe("./app/models/user.rb:12:1");
    expect(options[1]!.description).toBe("./app/controllers/users_controller.rb:45:3");
    expect(options[2]!.description).toBe("./app/models/order.rb:7:5");
  });

  test("color matches severityColor map", () => {
    expect(options[0]!.value.color).toBe(severityColor.convention);
    expect(options[1]!.value.color).toBe(severityColor.error);
    expect(options[2]!.value.color).toBe(severityColor.warning);
  });

  test("empty entries returns empty array", () => {
    expect(buildRubocopOptions([])).toEqual([]);
  });
});

describe("buildRubocopSummaryText", () => {
  test("formats offense count and inspected file count", () => {
    expect(
      buildRubocopSummaryText({ offense_count: 5, target_file_count: 10, inspected_file_count: 10 }),
    ).toBe("5 offenses in 10 files");
  });

  test("zero offenses", () => {
    expect(
      buildRubocopSummaryText({ offense_count: 0, target_file_count: 5, inspected_file_count: 5 }),
    ).toBe("0 offenses in 5 files");
  });
});

describe("flattenOffenses", () => {
  test("flattens multi-file result into flat array", () => {
    const result: RubocopResult = {
      files: [
        {
          path: "./app/models/user.rb",
          offenses: [conventionOffense.offense, errorOffense.offense],
        },
        {
          path: "./app/models/order.rb",
          offenses: [correctableOffense.offense],
        },
      ],
      summary: { offense_count: 3, target_file_count: 2, inspected_file_count: 2 },
    };

    const entries = flattenOffenses(result);
    expect(entries).toHaveLength(3);
    expect(entries[0]!.filePath).toBe("./app/models/user.rb");
    expect(entries[1]!.filePath).toBe("./app/models/user.rb");
    expect(entries[2]!.filePath).toBe("./app/models/order.rb");
  });

  test("empty files array returns empty result", () => {
    const result: RubocopResult = {
      files: [],
      summary: { offense_count: 0, target_file_count: 0, inspected_file_count: 0 },
    };
    expect(flattenOffenses(result)).toEqual([]);
  });

  test("file with multiple offenses preserves filePath for all entries", () => {
    const result: RubocopResult = {
      files: [
        {
          path: "./app/models/user.rb",
          offenses: [conventionOffense.offense, errorOffense.offense, correctableOffense.offense],
        },
      ],
      summary: { offense_count: 3, target_file_count: 1, inspected_file_count: 1 },
    };

    const entries = flattenOffenses(result);
    expect(entries).toHaveLength(3);
    for (const entry of entries) {
      expect(entry.filePath).toBe("./app/models/user.rb");
    }
  });
});
