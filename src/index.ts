import { createAppWindows } from "./windows";
import {
  runRspec,
  buildOptions,
  buildSummaryText,
} from "./rspec";

const specPath = process.argv[2] || "spec";
const exitAfterStart = process.env.LAZYRSPEC_EXIT_AFTER_START === "1";

let rspecResult = runRspec(specPath);
let examples = rspecResult.examples;
let options = buildOptions(examples);

if (options.length === 0) {
  console.log("No examples found.");
  process.exit(0);
}

let summaryText = "";
let hidePassed = false;

const { renderer, elapsed, setVisibleOptions, updateSummary } =
  await createAppWindows(examples[0]!, options[0]!);

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

renderer.keyInput.on("keypress", (key) => {
  if (key.name === "q" && !key.ctrl && !key.meta) {
    elapsed.destroy();
    renderer.destroy();
    process.exit(0);
  }
  if (key.name === "f" && !key.ctrl && !key.meta) {
    hidePassed = !hidePassed;
    applyFilter();
  }
  if (key.name === "r" && !key.ctrl && !key.meta) {
    elapsed.showMessage(" Running rspec...");
    setTimeout(() => {
      rspecResult = runRspec(specPath);
      examples = rspecResult.examples;
      options = buildOptions(examples);

      applyFilter();
      refreshSummary();
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
