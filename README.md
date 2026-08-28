# Agent-First 2D Game Construction Kit

This is an agent-first 2D game construction kit built on Phaser. It sits between a low-level engine and a finished template: stable infrastructure and reusable mechanics are provided, while a game agent retains room to compose a specific game.

The priority is reliable playable results, not engine-level abstraction.

## What is included

- Playable platformer, top-down, and runner archetypes
- Shared lifecycle, input, camera, UI, safe audio, and generated asset fallbacks
- Collectibles, health/damage, hazards, patrol/chase enemies, projectiles, timers, and powerups
- Machine-readable mechanic and archetype registries
- Development-only game debug API
- Vitest unit checks and Playwright browser smoke checks
- Three configuration-first example games
- Agent instructions and protected-area conventions

## Start and play

```bash
npm install
npm run dev
```

Open one of these paths on the displayed local URL:

```text
/?archetype=platformer
/?archetype=top-down
/?archetype=runner
```

Examples are available at:

```text
/?example=forest-platformer
/?example=robot-top-down
/?example=space-runner
```

## Required checks

```bash
npm run typecheck
npm run test
npm run build
npm run smoke-test
```

`smoke-test` builds the real browser bundle in test mode, loads it in Chromium without depending on a network port, and verifies startup, controls, progression, restart, debug state, and fatal errors.

## Architecture

```text
GameSpec + src/game/**       ← game branch edits here
            │
            ▼
      playable archetype     ← platformer / top-down / runner
            │
            ▼
      reusable mechanics     ← small composable behavior
            │
            ▼
        stable core          ← lifecycle / input / UI / assets
```

See `docs/architecture.md`, `registry/mechanics.json`, and `registry/archetypes.json` for detail.

## Agent workflow

Agents should read `AGENTS.md`, `GAME_SPEC.md`, the selected archetype documentation, and both registries before changing code. Prefer configuration, then composition, then extension, and only then custom logic.

Create each game from stable `main` on its own branch:

```bash
git switch main
git switch -c game/<game-slug>
```

Game work should primarily change `src/game/**`, `assets/**`, and configuration. Normal game creation should not modify `src/core/**`, `src/mechanics/**`, or `src/archetypes/**`.

If a game produces a genuinely reusable feature, finish the game first. Then extract and generalise the feature separately on `kit/<feature>`, add tests and agent-oriented documentation, and merge it into `main` only after review. This keeps one game from destabilising the shared kit.

## Placeholder assets

The initial asset library is generated at boot using stable identifiers such as `character.default`, `enemy.default`, and `collectible.coin`. Custom or optional media can be added under `assets/**`; a missing optional audio or visual asset must never prevent the game from running.
