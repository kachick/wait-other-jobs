import { spawn } from 'node:child_process';

const commands: [string, string[]][] = [
  ['dprint', ['fmt']],
  ['dprint', ['check']],
  ['oxlint', ['-c', '.oxlintrc.json', '--deny-warnings']],
  ['typos', ['.', '.github', '.vscode']],
  ['betterleaks', ['dir', '.']],
];

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}: ${command} ${args.join(' ')}`));
      }
    });
  });
}

await Promise.all(commands.map(([cmd, args]) => runCommand(cmd, args)));
