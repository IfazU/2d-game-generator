# Agent Instructions

## Purpose

You are building a game from an existing reusable 2D game kit. Produce a playable game quickly and reliably.

## Required order

1. Read `GAME_SPEC.md` and `src/game/config/GameSpec.ts`.
2. Read `docs/customization.md`, then inspect the selected archetype and `registry/mechanics.json`.
3. Configure `GameSpec`, archetype options, and the game catalog before writing a custom scene.
4. Compose existing mechanics and procedural texture helpers.
5. Extend a mechanic only when required.
6. Add a custom system only when necessary. Never recreate supplied functionality.

## Protected and editable areas

Normal game work belongs in `src/game/**`, `assets/**`, and configuration. Treat `src/core/**`, `src/mechanics/**`, and `src/archetypes/**` as protected unless explicitly asked to improve the kit.

If a feature risks destabilising the game, implement a smaller version that preserves its spirit. Playable beats perfect interpretation.

## Fullscreen presentation

Every game must fill the available browser viewport without page scrolling. Preserve the shared fullscreen shell in `src/main.ts`, `src/style.css`, and `index.html`; Phaser scales the 960×540 logical game area as large as possible without distortion. Keep essential game UI inside that logical safe area.

Do not add fixed-width outer wrappers, page margins, decorative frames, or padding around the canvas. Do not automatically invoke the browser Fullscreen API, which requires a user gesture and is separate from the required viewport-filling layout.

## Git workflow

Never build a game directly on `main`. Before creating or modifying any game files, run:

```text
npm run game:new -- <game-slug>
npm run game:check-branch
```

The first command requires a clean worktree, switches to stable `main`, creates a new `game/<slug>` branch, and refuses to reuse an existing branch. If it fails, do not begin game implementation or bypass the safeguard. Preserve existing work and resolve the reported condition.

Commit the finished game on its `game/<slug>` branch. Never merge a game branch into `main` unless the user explicitly requests that separate action. A reusable improvement is later extracted to `kit/<feature>` with tests and docs; do not mix that extraction into the game branch.

## Completion gate

Run and fix every failure:

```text
npm run game:check-branch
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npm run smoke-test
```
