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

const FOOTER_KEYS = " q: Quit  ↑↓: Navigate  r: Re-run  f: Filter passed";

export interface AppWindows {
  renderer: CliRenderer;
  elapsed: ElapsedTimer;
  setVisibleOptions(
    examples: RSpecExample[],
    options: ColoredSelectOption[],
  ): void;
  updateSummary(summaryText: string): void;
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

  const leftPanel = new BoxRenderable(renderer, {
    width: "45%",
    border: true,
    borderStyle: "rounded",
    borderColor: "#5599ff",
    title: " Tests ",
    padding: 1,
  });

  const select = createColoredSelect(renderer, {
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

  leftPanel.add(select);

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

  main.add(leftPanel);
  main.add(rightPanel);
  root.add(main);
  root.add(footer);
  renderer.root.add(root);

  let visibleExamples: RSpecExample[] = [initialExample];
  let visibleOptions: ColoredSelectOption[] = [initialOption];

  function renderSelected(selectIndex: number) {
    const example = visibleExamples[selectIndex];
    const option = visibleOptions[selectIndex];
    if (!example || !option) {
      titleText.content = "No tests to display";
      titleText.fg = "#ffffff";
      rightPanel.borderColor = "#ff9955";
      detailText.content = hidePassedDetailMessage();
      return;
    }

    titleText.content = example.full_description;
    titleText.fg = statusColor[example.status] || "#ffffff";
    rightPanel.borderColor = statusColor[example.status] || "#ff9955";
    detailText.content = option.value.detail;
  }

  function hidePassedDetailMessage() {
    return "No examples match the current filter.";
  }

  select.on(SelectRenderableEvents.SELECTION_CHANGED, () => {
    renderSelected(select.getSelectedIndex());
  });

  select.focus();

  return {
    renderer,
    elapsed,
    setVisibleOptions(examples, options) {
      visibleExamples = examples;
      visibleOptions = options;
      select.options = options as any;
      select.setSelectedIndex(0);
      renderSelected(0);
    },
    updateSummary(summaryText) {
      leftPanel.title = ` Tests (${summaryText}) `;
    },
  };
}
