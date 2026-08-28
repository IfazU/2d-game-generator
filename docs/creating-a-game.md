# Creating a Game

1. `git switch main`, then create `game/<slug>`.
2. Fill in `src/game/config/GameSpec.ts`.
3. Run all archetypes and select the closest behavior.
4. Copy or subclass only what the game needs under `src/game/**`.
5. Compose mechanics listed in `registry/mechanics.json`.
6. Add custom assets under the matching `assets/**` category; retain fallbacks.
7. Verify typecheck, unit tests, build, and smoke tests.

Do not put a reusable mechanic into `main` while finishing a game. Finish the game, then extract it on `kit/<feature>`.
