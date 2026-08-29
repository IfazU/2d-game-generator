# Architecture

```text
GameSpec + game catalog (declarative selection)
        ↓ creates
src/game (agent-owned composition)
        ↓ selects and configures
src/archetypes (playable starting games)
        ↓ composes
src/mechanics (small reusable behavior)
        ↓ relies on
src/core (stable lifecycle, input, UI, camera, assets, audio)
```

`main` is the stable kit. Game branches should remain above the archetype boundary whenever possible. Placeholder textures are generated at boot, so missing optional media cannot prevent startup.

Archetype options are the supported bridge between configuration and custom code. The debug registry and browser harness are test surfaces, not runtime dependencies in production.

The display shell in `src/main.ts`, `src/style.css`, and `index.html` is stable kit infrastructure. Its parent fills the browser viewport while Phaser `FIT` scaling preserves the 960×540 logical canvas. Games may customise scene backgrounds and HUD styling, but should not replace the shell with a fixed-size page layout.
