import { spawnSync } from 'node:child_process';

const insideGit = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
  stdio: 'ignore',
});

if (insideGit.status === 0) {
  const configured = spawnSync(
    'git',
    ['config', '--local', 'core.hooksPath', '.githooks'],
    { stdio: 'inherit' },
  );
  if (configured.status !== 0) process.exit(configured.status ?? 1);
  console.log('Installed repository Git safeguards from .githooks.');
}
