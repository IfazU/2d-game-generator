# Creating a Game

1. From a clean worktree, run `npm run game:new -- <slug>`. This switches to `main`, creates a new `game/<slug>` branch, and refuses existing branch names.
2. Run `npm run game:check-branch`. Do not create or edit game files until it succeeds.
3. Fill in `src/game/config/GameSpec.ts`, including a unique `id`.
4. Run all archetypes and select the closest behavior.
5. Try archetype options first. Add a custom scene under `src/game/**` only when the game shape genuinely differs.
6. Compose mechanics listed in `registry/mechanics.json`.
7. Use procedural textures or add assets under the matching `assets/**` category; retain fallbacks.
8. Register the game in `src/game/catalog/defaultCatalog.ts` and add a smoke case using the shared harness.
9. Verify the branch again, then run lint, formatting, typecheck, unit tests, build, and smoke tests.

Do not put a reusable mechanic into `main` while finishing a game. Finish the game, then extract it on `kit/<feature>`.

`npm install` configures the repository-managed pre-commit hook. It blocks direct commits on `main`; reviewed merge commits remain allowed.
