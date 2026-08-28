# Creating a Game

1. `git switch main`, then create `game/<slug>`.
2. Fill in `src/game/config/GameSpec.ts`, including a unique `id`.
3. Run all archetypes and select the closest behavior.
4. Try archetype options first. Add a custom scene under `src/game/**` only when the game shape genuinely differs.
5. Compose mechanics listed in `registry/mechanics.json`.
6. Use procedural textures or add assets under the matching `assets/**` category; retain fallbacks.
7. Register the game in `src/game/catalog/defaultCatalog.ts` and add a smoke case using the shared harness.
8. Verify lint, formatting, typecheck, unit tests, build, and smoke tests.

Do not put a reusable mechanic into `main` while finishing a game. Finish the game, then extract it on `kit/<feature>`.
