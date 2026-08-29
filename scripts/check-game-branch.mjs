import { execFileSync, spawnSync } from 'node:child_process';

const current = git(['branch', '--show-current']);
const mergeInProgress =
  spawnSync('git', ['rev-parse', '--verify', '--quiet', 'MERGE_HEAD'])
    .status === 0;

if (!current) fail('Game work is not allowed from a detached Git checkout.');

if (process.argv.includes('--pre-commit')) {
  if (current === 'main' && !mergeInProgress) {
    fail(
      'Direct commits on main are blocked. Use `npm run game:new -- <slug>` for a game or create `kit/<feature>` for kit work.',
    );
  }
  process.exit(0);
}

if (!current.startsWith('game/')) {
  fail(
    `New game work requires a game/<slug> branch; current branch is ${current}. Run \`npm run game:new -- <slug>\` first.`,
  );
}

console.log(`Game branch verified: ${current}`);

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    fail(`Git command failed: git ${args.join(' ')}`);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
