# Game Specification

Edit `src/game/config/GameSpec.ts` first. Give the game a unique `id`, choose the closest archetype, then list only mechanics the game actually needs. Use `gameplay`, `presentation`, and `input` for supported tuning. This file is structured context, not an attempt to model every feature.

Register that `id` in `src/game/catalog/defaultCatalog.ts`. `gameSpec.id` selects the default runtime scene; `/?game=<id>` selects any registered game explicitly.

Game-specific scenes, entities, and custom logic belong under `src/game/**`. Keep the initial version small enough to remain playable.

See `docs/customization.md` before changing protected archetype or core files.
