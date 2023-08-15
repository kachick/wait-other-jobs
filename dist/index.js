/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var import_core = require("@actions/core");
var import_github = require("@actions/github");
var import_ansi_styles = __toESM(require("ansi-styles"), 1);

// src/github-api.ts
function isAcceptable(conclusion) {
  return conclusion === "success" || conclusion === "skipped";
}
async function fetchJobIDs(octokit, params) {
  return new Set(
    await octokit.paginate(
      octokit.rest.actions.listJobsForWorkflowRun,
      {
        ...params,
        per_page: 100,
        filter: "latest"
      },
      (resp) => resp.data.map((job) => job.id)
    )
  );
}
async function fetchRunSummaries(octokit, params) {
  return await octokit.paginate(
    octokit.rest.checks.listForRef,
    {
      ...params,
      per_page: 100,
      filter: "latest"
    },
    (resp) => resp.data.map(
      (checkRun) => (({ id, status, conclusion, started_at, completed_at, html_url, name }) => ({
        source: {
          id,
          status,
          conclusion,
          started_at,
          completed_at,
          html_url,
          name
        },
        acceptable: isAcceptable(conclusion)
      }))(checkRun)
    ).sort((a, b) => a.source.id - b.source.id)
  );
}
async function fetchOtherRunStatus(octokit, params, ownJobIDs) {
  const checkRunSummaries = await fetchRunSummaries(octokit, params);
  const otherRelatedRuns = checkRunSummaries.flatMap(
    (summary) => ownJobIDs.has(summary.source.id) ? [] : [summary]
  );
  const otherRelatedCompletedRuns = otherRelatedRuns.filter((summary) => summary.source.status === "completed");
  const progress = otherRelatedCompletedRuns.length === otherRelatedRuns.length ? "done" : "in_progress";
  const conclusion = otherRelatedCompletedRuns.every((summary) => summary.acceptable) ? "acceptable" : "bad";
  return { progress, conclusion, summaries: otherRelatedRuns };
}

// src/wait.ts
var import_promises = require("timers/promises");
var wait = import_promises.setTimeout;
var retryMethods = ["exponential_backoff", "equal_intervals"];
var isRetryMethod = (method) => [...retryMethods].includes(method);
function getRandomInt(min, max) {
  const flooredMin = Math.ceil(min);
  return Math.floor(Math.random() * (Math.floor(max) - flooredMin) + flooredMin);
}
function readableDuration(milliseconds) {
  const msecToSec = 1e3;
  const secToMin = 60;
  const seconds = milliseconds / msecToSec;
  const minutes = seconds / secToMin;
  const { unit, value, precision } = minutes >= 1 ? { unit: "minutes", value: minutes, precision: 1 } : { unit: "seconds", value: seconds, precision: 0 };
  const adjustor = 10 ** precision;
  return `about ${(Math.round(value * adjustor) / adjustor).toFixed(
    precision
  )} ${unit}`;
}
var MIN_JITTER_MILLISECONDS = 1e3;
var MAX_JITTER_MILLISECONDS = 7e3;
function calcExponentialBackoffAndJitter(minIntervalSeconds, attempts) {
  const jitterMilliseconds = getRandomInt(MIN_JITTER_MILLISECONDS, MAX_JITTER_MILLISECONDS);
  return minIntervalSeconds * 2 ** (attempts - 1) * 1e3 + jitterMilliseconds;
}
function getIdleMilliseconds(method, minIntervalSeconds, attempts) {
  switch (method) {
    case "exponential_backoff":
      return calcExponentialBackoffAndJitter(
        minIntervalSeconds,
        attempts
      );
    case "equal_intervals":
      return minIntervalSeconds * 1e3;
    default: {
      const _exhaustiveCheck = method;
      return minIntervalSeconds * 1e3;
    }
  }
}

// src/main.ts
var errorMessage = (body) => `${import_ansi_styles.default.red.open}${body}${import_ansi_styles.default.red.close}`;
var succeededMessage = (body) => `${import_ansi_styles.default.green.open}${body}${import_ansi_styles.default.green.close}`;
var colorize = (body, ok) => ok ? succeededMessage(body) : errorMessage(body);
async function run() {
  (0, import_core.startGroup)("Parameters");
  const {
    repo: { repo, owner },
    payload,
    runId,
    sha
  } = import_github.context;
  const pr = payload.pull_request;
  let commitSha = sha;
  if (pr) {
    const { head: { sha: prSha = sha } } = pr;
    if (typeof prSha === "string") {
      commitSha = prSha;
    } else {
      if ((0, import_core.isDebug)()) {
        (0, import_core.debug)(JSON.stringify(pr, null, 2));
      }
      (0, import_core.error)("github context has unexpected format: missing context.payload.pull_request.head.sha");
      (0, import_core.setFailed)("unexpected failure occurred");
      return;
    }
  }
  const repositoryInfo = {
    owner,
    repo
  };
  const minIntervalSeconds = parseInt(
    (0, import_core.getInput)("min-interval-seconds", { required: true, trimWhitespace: true }),
    10
  );
  const retryMethod = (0, import_core.getInput)("retry-method", { required: true, trimWhitespace: true });
  if (!isRetryMethod(retryMethod)) {
    (0, import_core.setFailed)(
      `unknown parameter "${retryMethod}" is given. "retry-method" can take one of ${JSON.stringify(retryMethods)}`
    );
    return;
  }
  const attemptLimits = parseInt(
    (0, import_core.getInput)("attempt-limits", { required: true, trimWhitespace: true }),
    10
  );
  const isEarlyExit = (0, import_core.getBooleanInput)("early-exit", { required: true, trimWhitespace: true });
  const isDryRun = (0, import_core.getBooleanInput)("dry-run", { required: true, trimWhitespace: true });
  (0, import_core.info)(JSON.stringify(
    {
      triggeredCommitSha: commitSha,
      ownRunId: runId,
      repositoryInfo,
      minIntervalSeconds,
      retryMethod,
      attemptLimits,
      isEarlyExit,
      isDryRun
      // Of course, do NOT include tokens here.
    },
    null,
    2
  ));
  const githubToken = (0, import_core.getInput)("github-token", { required: true, trimWhitespace: false });
  (0, import_core.setSecret)(githubToken);
  const octokit = (0, import_github.getOctokit)(githubToken);
  let attempts = 0;
  let shouldStop = false;
  (0, import_core.endGroup)();
  if (isDryRun) {
    return;
  }
  (0, import_core.startGroup)("Get own job_id");
  const ownJobIDs = await fetchJobIDs(octokit, { ...repositoryInfo, run_id: runId });
  (0, import_core.info)(JSON.stringify({ ownJobIDs: [...ownJobIDs] }, null, 2));
  (0, import_core.endGroup)();
  for (; ; ) {
    attempts += 1;
    if (attempts > attemptLimits) {
      (0, import_core.setFailed)(errorMessage(`reached to given attempt limits "${attemptLimits}"`));
      break;
    }
    const msec = getIdleMilliseconds(retryMethod, minIntervalSeconds, attempts);
    (0, import_core.info)(`Wait ${readableDuration(msec)} before next polling to reduce API calls.`);
    await wait(msec);
    (0, import_core.startGroup)(`Polling ${attempts}: ${(/* @__PURE__ */ new Date()).toISOString()}`);
    const report = await fetchOtherRunStatus(
      octokit,
      { ...repositoryInfo, ref: commitSha },
      ownJobIDs
    );
    for (const summary of report.summaries) {
      const { acceptable, source: { id, status, conclusion: conclusion2, name, html_url } } = summary;
      const nullStr = "(null)";
      const nullHandledConclusion = conclusion2 ?? nullStr;
      (0, import_core.info)(
        `${id} - ${colorize(status, status === "completed")} - ${colorize(nullHandledConclusion, acceptable)}: ${name} - ${html_url ?? nullStr}`
      );
    }
    if ((0, import_core.isDebug)()) {
      (0, import_core.debug)(JSON.stringify(report, null, 2));
    }
    const { progress, conclusion } = report;
    switch (progress) {
      case "in_progress": {
        if (conclusion === "bad" && isEarlyExit) {
          shouldStop = true;
          (0, import_core.setFailed)(errorMessage("some jobs failed"));
        }
        (0, import_core.info)("some jobs still in progress");
        break;
      }
      case "done": {
        shouldStop = true;
        switch (conclusion) {
          case "acceptable": {
            (0, import_core.info)(succeededMessage("all jobs passed"));
            break;
          }
          case "bad": {
            (0, import_core.setFailed)(errorMessage("some jobs failed"));
            break;
          }
          default: {
            const unexpectedConclusion = conclusion;
            (0, import_core.setFailed)(errorMessage(`got unexpected conclusion: ${unexpectedConclusion}`));
            break;
          }
        }
        break;
      }
      default: {
        shouldStop = true;
        const unexpectedProgress = progress;
        (0, import_core.setFailed)(errorMessage(`got unexpected progress: ${unexpectedProgress}`));
        break;
      }
    }
    (0, import_core.endGroup)();
    if (shouldStop) {
      break;
    }
  }
}
void run();

