import { summary } from '@actions/core';
import { type PollingReport, type Severity, severities, type Summary } from './report.ts';
import type { RuntimeOptions } from './schema.ts';

function getEmoji(severity: Severity): string {
  return severities[severity].emoji;
}

function compareLevel(a: Summary, b: Summary): number {
  return severities[a.severity].level - severities[b.severity].level;
}

export function writeJobSummary(lastPolling: PollingReport, options: RuntimeOptions): void {
  summary.addHeading('wait-other-jobs', 1);

  summary.addHeading('Conclusion', 2);

  if (lastPolling.ok) {
    summary.addRaw(`${getEmoji('notice')} All jobs passed`, true);
  } else {
    summary.addRaw(`${getEmoji('error')} Failed`, true);

    if (options.isEarlyExitEnabled) {
      summary.addHeading('Note', 3);
      summary.addRaw(
        'This job was run with the early-exit mode enabled, so some targets might be shown in an incomplete state.',
        true,
      );
    }
  }

  summary.addHeading('Details', 2);

  const headers = [
    { data: 'Severity', header: true },
    { data: 'Workflow', header: true },
    { data: 'Job', header: true },
    { data: 'Event', header: true },
    { data: 'Status', header: true },
    { data: 'Conclusion', header: true },
    { data: 'Log', header: true },
  ];

  summary.addTable([
    headers,
    ...(lastPolling.summaries.toSorted(compareLevel).map((
      { severity, workflowPermalink, workflowBasename, jobName, eventName, runStatus, runConclusion, checkRunUrl },
    ) => [{
      data: getEmoji(severity),
    }, {
      // e.g. AFAIK, we can't access and control github provided dependabot workflow except the run logs. The event type is `dynamic`.
      data: eventName === 'dynamic' ? workflowBasename : `<a href="${workflowPermalink}">${workflowBasename}</a>`,
    }, {
      data: jobName,
    }, {
      data: eventName,
    }, {
      data: runStatus,
    }, {
      data: runConclusion ?? '',
    }, {
      data: `<a href="${checkRunUrl}">Link</a>`, // Can't use []() style and there is no special option. See https://github.com/actions/toolkit/issues/1544
    }])),
  ]);

  summary.write();
}
