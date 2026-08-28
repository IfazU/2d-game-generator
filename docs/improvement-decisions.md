# Kit Improvement Decisions

This record keeps the kit’s evolution deliberate.

## Implemented

| Suggestion                      | Decision and implementation                                                                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Declarative scene/game registry | Implemented with `GameCatalog`, duplicate validation, clear unknown-id errors, and `?game=<id>` selection. `GameSpec.id` now drives the default game. |
| Configurable HUD                | Implemented optional metrics, labels, objective visibility, end-state copy, and colours. Defaults preserve existing games.                            |
| Better debug extensibility      | Implemented game-specific state providers, named actions, and a clock value. The registry is engine-independent and unit tested.                      |
| Procedural texture helpers      | Implemented idempotent rounded rectangle, circle, polygon, and custom-draw helpers. Placeholder assets now reuse them.                                |
| Phaser bundle split             | Implemented a dedicated cacheable Phaser vendor chunk. The small game chunk is now separate, while the known Phaser size is explicitly accepted.      |
| Archetype customisation         | Implemented common presentation/input options plus focused platformer, top-down, and runner physics tuning.                                           |
| Reusable smoke-test setup       | Implemented a shared built-bundle route and playable-state helper to reduce copied test infrastructure.                                               |
| Configurable key bindings       | Implemented per-action overrides while retaining stable defaults.                                                                                     |

## Deliberately constrained

| Suggestion                       | Decision                                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deterministic physics stepping   | Deferred. A generic scheduler would couple the kit deeply to Phaser internals and create a second runtime mode. Prefer state-driven assertions and named debug actions. Revisit only if multiple generated games prove timing remains a recurring blocker. |
| Dynamic scene imports            | Deferred. Vendor splitting captures most caching value without asynchronous scene-loading complexity. Revisit when the catalog contains enough large custom games to affect startup.                                                                       |
| Fully data-driven levels         | Deferred. Fixed JSON schemas would restrict game ideas or become an engine/editor project. Keep level data game-local and explicit.                                                                                                                        |
| Generic effects/plugin framework | Rejected for V1. Small mechanics and direct composition are easier for agents to understand and harder to break.                                                                                                                                           |
| Live editor/ECS                  | Rejected as outside the kit’s goal.                                                                                                                                                                                                                        |

## Next candidates, only when evidence supports them

1. Add mobile virtual controls if multiple games require simultaneous touch movement rather than single-tap actions.
2. Add sprite-sheet animation helpers after at least two games need the same animation-loading convention.
3. Add tilemap helpers when authored multi-screen levels become common.
4. Add deterministic seeded randomness if procedural games make browser tests flaky.
