import { env, execPath } from 'process';
import { execFileSync, ExecFileSyncOptions } from 'child_process';
import { join } from 'path';
import { expect, test } from '@jest/globals';

// shows how the runner will run a javascript action with env / stdout protocol
test('runs', () => {
  env['INPUT_GITHUB-TOKEN'] = 'DUMMY_GITHUB_TOKEN-32191280-2027-45a4-b1c1-1050e0054bfc';
  env['INPUT_MIN-INTERVAL-SECONDS'] = '30';
  env['INPUT_DRY-RUN'] = 'true';
  env['INPUT_EARLY-EXIT'] = 'true';
  env['GITHUB_REPOSITORY'] = 'kachick/wait-other-jobs';
  env['GITHUB_RUN_ID'] = '2408217435';
  const np = execPath;
  const ip = join(__dirname, '../..', 'lib', 'main.js');
  const options: ExecFileSyncOptions = {
    env,
  };
  const output = execFileSync(np, [ip], options).toString();
  expect(output).toMatch(/\b2408217435\b/);
  expect(output).toMatch(/::add-mask::DUMMY_GITHUB_TOKEN-32191280-2027-45a4-b1c1-1050e0054bfc/);
});
