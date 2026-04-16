import {
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
  type CliRenderer,
} from "@opentui/core";
import {
  createColoredSelect,
  SelectRenderableEvents,
  type ColoredSelectOption,
} from "./colored-select";
import { ElapsedTimer } from "./elapsed-timer";
import { statusColor, type RSpecExample } from "./rspec";

const FOOTER_KEYS = " q: Quit  1/2: Switch panel  ↑↓: Navigate  r: Re-run  f: Filter passed";
const ACTIVE_BORDER = "#5599ff";
const INACTIVE_BORDER = "#334455";

export interface AppWindows {
  renderer: CliRenderer;
  elapsed: ElapsedTimer;
  setVisibleOptions(
    examples: RSpecExample[],
    options: ColoredSelectOption[],
  ): void;
  updateSummary(summaryText: string): void;
  setRubocopOptions(options: ColoredSelectOption[]): void;
  updateRubocopSummary(summaryText: string): void;
  setActivePanel(panel: "rspec" | "rubocop"): void;
}

export interface CreateAppWindowsOptions {
  renderer?: CliRenderer;
}

export async function createAppWindows(
  initialExample: RSpecExample,
  initialOption: ColoredSelectOption,
  opts: CreateAppWindowsOptions = {},
): Promise<AppWindows> {
  const renderer =
    opts.renderer ||
    (await createCliRenderer({
      exitOnCtrlC: true,
    }));

  const root = new BoxRenderable(renderer, {
    width: "100%",
    height: "100%",
    flexDirection: "column",
  });

  const main = new BoxRenderable(renderer, {
    width: "100%",
    flexGrow: 1,
    flexDirection: "row",
  });

  const leftColumn = new BoxRenderable(renderer, {
    width: "45%",
    height: "100%",
    flexDirection: "column",
  });

  const rspecPanel = new BoxRenderable(renderer, {
    width: "100%",
    flexGrow: 1,
    border: true,
    borderStyle: "rounded",
    borderColor: ACTIVE_BORDER,
    title: " 1. RSpec ",
    padding: 1,
  });

  const rspecSelect = createColoredSelect(renderer, {
    width: "100%",
    height: "100%",
    options: [initialOption],
    selectedIndex: 0,
    backgroundColor: "transparent",
    selectedBackgroundColor: "#334455",
    focusedBackgroundColor: "transparent",
    focusedTextColor: "#ffffff",
    textColor: "#aaaaaa",
    showDescription: true,
    wrapSelection: true,
  });

  rspecPanel.add(rspecSelect);

  const rubocopPanel = new BoxRenderable(renderer, {
    width: "100%",
    flexGrow: 1,
    border: true,
    borderStyle: "rounded",
    borderColor: INACTIVE_BORDER,
    title: " 2. RuboCop ",
    padding: 1,
  });

  const rubocopSelect = createColoredSelect(renderer, {
    width: "100%",
    height: "100%",
    options: [],
    selectedIndex: 0,
    backgroundColor: "transparent",
    selectedBackgroundColor: "#334455",
    focusedBackgroundColor: "transparent",
    focusedTextColor: "#ffffff",
    textColor: "#aaaaaa",
    showDescription: true,
    wrapSelection: true,
  });

  const noOffensesText = new TextRenderable(renderer, {
    content: "  ✓ No offenses found.",
    fg: "#22cc22",
    wrapMode: "word",
  });

  rubocopPanel.add(rubocopSelect);
  rubocopPanel.add(noOffensesText);
  rubocopSelect.visible = false;
  noOffensesText.visible = false;

  leftColumn.add(rspecPanel);
  leftColumn.add(rubocopPanel);

  const rightPanel = new BoxRenderable(renderer, {
    width: "55%",
    border: true,
    borderStyle: "rounded",
    borderColor: "#ff9955",
    title: " Details ",
    padding: 1,
  });

  const titleText = new TextRenderable(renderer, {
    content: initialExample.full_description,
    wrapMode: "word",
    fg: statusColor[initialExample.status] || "#ffffff",
  });

  const detailText = new TextRenderable(renderer, {
    content: initialOption.value.detail,
    wrapMode: "word",
    fg: "#ffffff",
  });

  rightPanel.add(titleText);
  rightPanel.add(detailText);

  const footer = new BoxRenderable(renderer, {
    width: "100%",
    height: 1,
  });

  const elapsed = new ElapsedTimer(renderer, {
    prefix: FOOTER_KEYS,
    fg: "#888888",
  });

  footer.add(elapsed.text);

  main.add(leftColumn);
  main.add(rightPanel);
  root.add(main);
  root.add(footer);
  renderer.root.add(root);

  let visibleExamples: RSpecExample[] = [initialExample];
  let visibleOptions: ColoredSelectOption[] = [initialOption];
  let rubocopOptions: ColoredSelectOption[] = [];
  let activePanel: "rspec" | "rubocop" = "rspec";

  function renderRspecSelected(index: number) {
    const example = visibleExamples[index];
    const option = visibleOptions[index];
    if (!example || !option) {
      titleText.content = "No tests to display";
      titleText.fg = "#ffffff";
      rightPanel.borderColor = "#ff9955";
      detailText.content = "No examples match the current filter.";
      return;
    }
    titleText.content = example.full_description;
    titleText.fg = statusColor[example.status] || "#ffffff";
    rightPanel.borderColor = statusColor[example.status] || "#ff9955";
    detailText.content = option.value.detail;
  }

  function renderRubocopSelected(index: number) {
    const option = rubocopOptions[index];
    if (!option) {
      titleText.content = "No offense selected";
      titleText.fg = "#ffffff";
      rightPanel.borderColor = "#ff9955";
      detailText.content = "";
      return;
    }
    titleText.content = option.name;
    titleText.fg = option.value.color;
    rightPanel.borderColor = option.value.color;
    detailText.content = option.value.detail;
  }

  function setPanelActive(panel: "rspec" | "rubocop") {
    activePanel = panel;
    if (panel === "rspec") {
      rspecPanel.borderColor = ACTIVE_BORDER;
      rubocopPanel.borderColor = INACTIVE_BORDER;
      rspecSelect.focus();
      rubocopSelect.blur();
      renderRspecSelected(rspecSelect.getSelectedIndex());
    } else {
      rspecPanel.borderColor = INACTIVE_BORDER;
      rubocopPanel.borderColor = ACTIVE_BORDER;
      rspecSelect.blur();
      rubocopSelect.focus();
      renderRubocopSelected(rubocopSelect.getSelectedIndex());
    }
  }

  rspecSelect.on(SelectRenderableEvents.SELECTION_CHANGED, () => {
    if (activePanel === "rspec") {
      renderRspecSelected(rspecSelect.getSelectedIndex());
    }
  });

  rubocopSelect.on(SelectRenderableEvents.SELECTION_CHANGED, () => {
    if (activePanel === "rubocop") {
      renderRubocopSelected(rubocopSelect.getSelectedIndex());
    }
  });

  rspecSelect.focus();

  return {
    renderer,
    elapsed,
    setVisibleOptions(examples, options) {
      visibleExamples = examples;
      visibleOptions = options;
      rspecSelect.options = options as any;
      rspecSelect.setSelectedIndex(0);
      if (activePanel === "rspec") renderRspecSelected(0);
    },
    updateSummary(summaryText) {
      rspecPanel.title = ` 1. RSpec (${summaryText}) `;
    },
    setRubocopOptions(options) {
      rubocopOptions = options;
      if (options.length === 0) {
        rubocopSelect.visible = false;
        noOffensesText.visible = true;
      } else {
        rubocopSelect.options = options as any;
        rubocopSelect.setSelectedIndex(0);
        rubocopSelect.visible = true;
        noOffensesText.visible = false;
        if (activePanel === "rubocop") renderRubocopSelected(0);
      }
    },
    updateRubocopSummary(summaryText) {
      rubocopPanel.title = ` 2. RuboCop (${summaryText}) `;
    },
    setActivePanel(panel) {
      setPanelActive(panel);
    },
  };
}
