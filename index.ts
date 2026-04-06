import {
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
} from "@opentui/core";
import {
  createColoredSelect,
  SelectRenderableEvents,
} from "./colored-select";
import {
  runRspec,
  buildOptions,
  buildSummaryText,
  statusColor,
} from "./rspec";

const specPath = process.argv[2] || "spec";

let rspecResult = runRspec(specPath);
let examples = rspecResult.examples;
let options = buildOptions(examples);

if (options.length === 0) {
  console.log("No examples found.");
  process.exit(0);
}

let summaryText = "";

const renderer = await createCliRenderer({
  exitOnCtrlC: true,
});

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
  options,
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
  content: examples[0]!.full_description,
  wrapMode: "word",
  fg: statusColor[examples[0]!.status] || "#ffffff",
});

const detailText = new TextRenderable(renderer, {
  content: options[0]!.value.detail,
  wrapMode: "word",
  fg: "#ffffff",
});

rightPanel.add(titleText);
rightPanel.add(detailText);

const footer = new BoxRenderable(renderer, {
  width: "100%",
  height: 1,
});

const FOOTER_KEYS = " q: Quit  ↑↓: Navigate  r: Re-run";

const footerText = new TextRenderable(renderer, {
  content: FOOTER_KEYS,
  fg: "#888888",
  wrapMode: "none",
  truncate: true,
});

footer.add(footerText);

function showSelected(index: number) {
  const ex = examples[index];
  const opt = options[index];
  if (!ex || !opt) return;
  titleText.content = ex.full_description;
  titleText.fg = statusColor[ex.status] || "#ffffff";
  rightPanel.borderColor = statusColor[ex.status] || "#ff9955";
  detailText.content = opt.value.detail;
}

function updateSummary() {
  summaryText = buildSummaryText(rspecResult.summary);
  leftPanel.title = ` Tests (${summaryText}) `;
}

showSelected(0);
updateSummary();

select.on(SelectRenderableEvents.SELECTION_CHANGED, () => {
  showSelected(select.getSelectedIndex());
});

main.add(leftPanel);
main.add(rightPanel);
root.add(main);
root.add(footer);
renderer.root.add(root);

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q" && !key.ctrl && !key.meta) {
    renderer.destroy();
    process.exit(0);
  }
  if (key.name === "r" && !key.ctrl && !key.meta) {
    footerText.content = " Running rspec...";
    setTimeout(() => {
      rspecResult = runRspec(specPath);
      examples = rspecResult.examples;
      options = buildOptions(examples);

      select.options = options as any;
      select.setSelectedIndex(0);

      showSelected(0);
      updateSummary();
      footerText.content = FOOTER_KEYS;
    }, 10);
  }
});

select.focus();
renderer.start();
