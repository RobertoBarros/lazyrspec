import { createAppWindows } from "./windows";
import {
  checkRspecInstalled,
  runRspec,
  buildOptions,
  buildSummaryText,
  type RSpecResult,
  type RSpecExample,
} from "./rspec";
import {
  checkRubocopInstalled,
  runRubocop,
  buildRubocopOptions,
  buildRubocopSummaryText,
  flattenOffenses,
  type RubocopResult,
  type RubocopOffenseEntry,
} from "./rubocop";
import { type ColoredSelectOption } from "./colored-select";

checkRspecInstalled();

const specPath = process.argv[2] || "spec";
const exitAfterStart = process.env.LAZYRSPEC_EXIT_AFTER_START === "1";
const rubocopAvailable = checkRubocopInstalled();

let rspecResult: RSpecResult;
let examples: RSpecExample[] = [];
let options: ColoredSelectOption[] = [];
let rubocopResult: RubocopResult | null = null;
let offenseEntries: RubocopOffenseEntry[] = [];
let rubocopOpts: ColoredSelectOption[] = [];

let summaryText = "";
let hidePassed = false;
let activePanel: "rspec" | "rubocop" = "rspec";

const {
  renderer,
  elapsed,
  setVisibleOptions,
  updateSummary,
  setRubocopOptions,
  updateRubocopSummary,
  setActivePanel,
  showProcessingOverlay,
  hideProcessingOverlay,
} = await createAppWindows();

function applyFilter() {
  const visibleExamples = hidePassed
    ? examples.filter((ex) => ex.status !== "passed")
    : examples;
  const visibleOptions = hidePassed
    ? options.filter((_, index) => examples[index]!.status !== "passed")
    : options;

  setVisibleOptions(visibleExamples, visibleOptions);
}

function refreshSummary() {
  summaryText = buildSummaryText(rspecResult.summary);
  updateSummary(summaryText);
}

function runRubocop_() {
  rubocopResult = runRubocop(".");
  offenseEntries = flattenOffenses(rubocopResult!);
  rubocopOpts = buildRubocopOptions(offenseEntries);
  setRubocopOptions(rubocopOpts);
  updateRubocopSummary(buildRubocopSummaryText(rubocopResult!.summary));
}

renderer.start();

// Initial run
showProcessingOverlay(" running rspec");
setTimeout(() => {
  rspecResult = runRspec(specPath);
  examples = rspecResult.examples;
  options = buildOptions(examples);

  if (examples.length === 0) {
    hideProcessingOverlay();
    elapsed.destroy();
    renderer.destroy();
    console.log("No examples found.");
    process.exit(0);
  }

  applyFilter();
  refreshSummary();

  if (rubocopAvailable) {
    showProcessingOverlay(" running rubocop");
    setTimeout(() => {
      runRubocop_();
      hideProcessingOverlay();
      elapsed.reset();
    }, 10);
  } else {
    hideProcessingOverlay();
    elapsed.reset();
  }
}, 10);

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q" && !key.ctrl && !key.meta) {
    elapsed.destroy();
    renderer.destroy();
    process.exit(0);
  }
  if (key.name === "1" && !key.ctrl && !key.meta) {
    activePanel = "rspec";
    setActivePanel(activePanel);
  }
  if (key.name === "2" && !key.ctrl && !key.meta) {
    activePanel = "rubocop";
    setActivePanel(activePanel);
  }
  if (key.name === "f" && !key.ctrl && !key.meta && activePanel === "rspec") {
    hidePassed = !hidePassed;
    applyFilter();
  }
  if (key.name === "r" && !key.ctrl && !key.meta) {
    showProcessingOverlay(" running rspec");
    setTimeout(() => {
      rspecResult = runRspec(specPath);
      examples = rspecResult.examples;
      options = buildOptions(examples);

      applyFilter();
      refreshSummary();

      if (rubocopAvailable) {
        showProcessingOverlay(" running rubocop");
        setTimeout(() => {
          runRubocop_();
          hideProcessingOverlay();
          elapsed.reset();
        }, 10);
      } else {
        hideProcessingOverlay();
        elapsed.reset();
      }
    }, 10);
  }
});

if (exitAfterStart) {
  elapsed.destroy();
  renderer.destroy();
  process.exit(0);
}
