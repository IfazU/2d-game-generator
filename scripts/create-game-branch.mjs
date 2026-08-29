import { execFileSync, spawnSync } from 'node:child_process';

const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail('Usage: npm run game:new -- <lowercase-kebab-case-slug>');
}

const root = git(['rev-parse', '--show-toplevel']);
process.chdir(root);

if (git(['status', '--porcelain', '--untracked-files=all'])) {
  fail(
    'The worktree is not clean. Preserve the existing changes and resolve them before creating a game branch.',
  );
}

const branch = `game/${slug}`;
if (
  refExists(`refs/heads/${branch}`) ||
  refExists(`refs/remotes/origin/${branch}`)
) {
  fail(
    `${branch} already exists. Continue it only when explicitly requested; otherwise choose a new slug.`,
  );
}

if (!refExists('refs/heads/main')) {
  fail('Local main is missing. Create or fetch the stable main branch first.');
}

runGit(['switch', 'main']);
runGit(['switch', '-c', branch]);

const current = git(['branch', '--show-current']);
if (current !== branch) fail(`Expected ${branch}, but Git reports ${current}.`);

console.log(`Ready to create the game on ${branch}.`);

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    fail(`Git command failed: git ${args.join(' ')}`);
  }
}

function runGit(args) {
  const result = spawnSync('git', args, { stdio: 'inherit' });
  if (result.status !== 0) fail(`Git command failed: git ${args.join(' ')}`);
}

function refExists(ref) {
  return (
    spawnSync('git', ['show-ref', '--verify', '--quiet', ref]).status === 0
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
