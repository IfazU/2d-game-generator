---
name: create-2d-game
description: Create a new browser game from this 2D game kit. Use whenever a user asks to build, generate, scaffold, or start a game in this repository.
---

# Create a 2D Game

Create every game on a new branch from stable `main`. Branch setup is a required precondition, not a cleanup step.

## Before editing game files

1. Read the root `AGENTS.md` and `GAME_SPEC.md`.
2. Confirm the worktree is clean. Preserve existing changes; never stash, discard, or overwrite them merely to create a branch.
3. Choose a lowercase kebab-case slug that identifies this game.
4. Run `npm run game:new -- <slug>`. Do not manually edit `src/game/**`, assets, configuration, or tests before this succeeds.
5. Run `npm run game:check-branch` and confirm the branch is exactly `game/<slug>`.

If the requested branch already exists, do not silently reuse or overwrite it. Inspect whether the request is to continue that game; otherwise choose a distinct slug or ask the user.

## Build and finish

Follow the configuration-first order in `AGENTS.md`. Keep game-specific work on the new game branch and reusable kit improvements on a later `kit/<feature>` branch.

Preserve the kit's fullscreen shell in `src/main.ts`, `src/style.css`, and `index.html`. Every game must fill the browser viewport without page scrolling while Phaser preserves the 960×540 design aspect ratio. Keep essential HUD and controls inside that logical safe area; do not add fixed-width page wrappers, outer padding, or automatic browser Fullscreen API calls.

Use proportional typefaces for all game UI and presentation. Do not use monospace fonts or any mono-related font family, fallback, or visual treatment.

Before reporting completion, rerun `npm run game:check-branch` followed by the full completion gate in `AGENTS.md`. Commit the game on `game/<slug>`; never merge it into `main` unless the user explicitly requests that separate action.
