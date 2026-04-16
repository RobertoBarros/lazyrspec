import { createAppWindows } from "./windows";
import {
  checkRspecInstalled,
  runRspec,
  buildOptions,
  buildSummaryText,
} from "./rspec";
import {
  checkRubocopInstalled,
  runRubocop,
  buildRubocopOptions,
  buildRubocopSummaryText,
  flattenOffenses,
} from "./rubocop";

checkRspecInstalled();

const specPath = process.argv[2] || "spec";
const exitAfterStart = process.env.LAZYRSPEC_EXIT_AFTER_START === "1";

let rspecResult = runRspec(specPath);
let examples = rspecResult.examples;
let options = buildOptions(examples);

if (options.length === 0) {
  console.log("No examples found.");
  process.exit(0);
}

const rubocopAvailable = checkRubocopInstalled();
let rubocopResult = rubocopAvailable ? runRubocop(".") : null;
let offenseEntries = rubocopResult ? flattenOffenses(rubocopResult) : [];
let rubocopOpts = buildRubocopOptions(offenseEntries);

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
} = await createAppWindows(examples[0]!, options[0]!);

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

applyFilter();
refreshSummary();

setRubocopOptions(rubocopOpts);
if (rubocopResult) {
  updateRubocopSummary(buildRubocopSummaryText(rubocopResult.summary));
}

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
    elapsed.showMessage(" Running...");
    setTimeout(() => {
      rspecResult = runRspec(specPath);
      examples = rspecResult.examples;
      options = buildOptions(examples);

      applyFilter();
      refreshSummary();

      if (rubocopAvailable) {
        rubocopResult = runRubocop(".");
        offenseEntries = flattenOffenses(rubocopResult!);
        rubocopOpts = buildRubocopOptions(offenseEntries);
        setRubocopOptions(rubocopOpts);
        updateRubocopSummary(buildRubocopSummaryText(rubocopResult!.summary));
      }

      elapsed.reset();
    }, 10);
  }
});

renderer.start();

if (exitAfterStart) {
  elapsed.destroy();
  renderer.destroy();
  process.exit(0);
}
