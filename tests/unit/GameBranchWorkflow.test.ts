import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';

const temporaryRepositories: string[] = [];

afterEach(() => {
  for (const repository of temporaryRepositories.splice(0))
    rmSync(repository, { recursive: true, force: true });
});

describe('game branch workflow', () => {
  test('creates a new game branch from a clean main branch', () => {
    const repository = createRepository();

    const result = runNode(
      repository,
      'create-game-branch.mjs',
      'cloud-runner',
    );

    expect(result.status).toBe(0);
    expect(git(repository, ['branch', '--show-current'])).toBe(
      'game/cloud-runner',
    );
  });

  test('preserves a dirty worktree instead of switching branches', () => {
    const repository = createRepository();
    writeFileSync(join(repository, 'uncommitted.txt'), 'preserve me');

    const result = runNode(repository, 'create-game-branch.mjs', 'new-game');

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('worktree is not clean');
    expect(git(repository, ['branch', '--show-current'])).toBe('main');
  });

  test('rejects reused game branches and direct main commits', () => {
    const repository = createRepository();
    git(repository, ['branch', 'game/existing']);

    const duplicate = runNode(repository, 'create-game-branch.mjs', 'existing');
    const mainCommit = runNode(
      repository,
      'check-game-branch.mjs',
      '--pre-commit',
    );

    expect(duplicate.status).toBe(1);
    expect(duplicate.stderr).toContain('already exists');
    expect(mainCommit.status).toBe(1);
    expect(mainCommit.stderr).toContain('Direct commits on main are blocked');
  });
});

function createRepository(): string {
  const repository = mkdtempSync(join(tmpdir(), 'game-branch-workflow-'));
  temporaryRepositories.push(repository);
  copyFileSync(
    resolve('scripts/create-game-branch.mjs'),
    join(repository, 'create-game-branch.mjs'),
  );
  copyFileSync(
    resolve('scripts/check-game-branch.mjs'),
    join(repository, 'check-game-branch.mjs'),
  );
  git(repository, ['init', '--quiet']);
  git(repository, ['config', 'user.name', 'Branch Test']);
  git(repository, ['config', 'user.email', 'branch-test@example.invalid']);
  writeFileSync(join(repository, 'README.md'), 'test repository');
  git(repository, [
    'add',
    'README.md',
    'create-game-branch.mjs',
    'check-game-branch.mjs',
  ]);
  git(repository, ['commit', '--quiet', '-m', 'initial']);
  git(repository, ['branch', '-M', 'main']);
  return repository;
}

function git(repository: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: repository,
    encoding: 'utf8',
  }).trim();
}

function runNode(repository: string, script: string, argument: string) {
  return spawnSync(process.execPath, [script, argument], {
    cwd: repository,
    encoding: 'utf8',
  });
}
