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

## Git workflow

Never build a game directly on `main`. Start from clean `main` and create `game/<slug>`. A reusable improvement is later extracted to `kit/<feature>` with tests and docs; do not mix that extraction into the game branch.

## Completion gate

Run and fix every failure:

```text
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npm run smoke-test
```
