# Architecture

```text
src/game (agent-owned composition)
        ↓ selects and configures
src/archetypes (playable starting games)
        ↓ composes
src/mechanics (small reusable behavior)
        ↓ relies on
src/core (stable lifecycle, input, UI, camera, assets, audio)
```

`main` is the stable kit. Game branches should remain above the archetype boundary whenever possible. Placeholder textures are generated at boot, so missing optional media cannot prevent startup.
