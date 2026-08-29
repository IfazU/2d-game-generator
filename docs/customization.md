# Customization Surfaces

Use the narrowest surface that solves the game requirement.

## 1. GameSpec

`src/game/config/GameSpec.ts` is the default game selection and structured brief. It supports:

- `id` and `archetype`
- title, theme, player, objective, enemies, and requested mechanics
- gameplay tuning such as movement, jumping, enemy/projectile speed, runner acceleration, health, and finish distance
- presentation tuning such as background, controls copy, and HUD options
- keyboard binding overrides

Set `gameSpec.id` to a registered catalog entry to make it the default game.

## 2. Game catalog

Register a game in `src/game/catalog/defaultCatalog.ts`:

```ts
.register({
  id: 'my-game',
  description: 'Short machine-readable description.',
  spec: mySpec,
  createScene: () => new MyGameScene(),
})
```

The game then runs at `/?game=my-game`. Legacy `?archetype=` and `?example=` URLs continue to work through the same catalog.

## 3. Archetype options

The built-in scenes accept an options object. Common options are:

- `title`, `objective`, `controlsText`, and `backgroundColor`
- `health`
- `hud`
- `input`

Platformer tuning adds movement, jump, gravity, enemy speed, and collectible score. Top-down tuning adds movement, chase, projectile, cooldown, and hit-invulnerability values. Runner tuning adds base/maximum speed, acceleration, jumping, gravity, fast-fall, and finish distance.

Prefer these options over editing `src/archetypes/**`.

## 4. HUD

`HudOptions` can hide score, health, or objective; rename score/health; customise win/loss/restart copy; and change panel/accent colours.

## 5. Input

Pass an `InputBindings` object using Phaser key codes. Only override actions that differ from the defaults.

## 6. Procedural textures

Use `createRoundedRectTexture`, `createCircleTexture`, `createPolygonTexture`, or `createProceduralTexture` from `src/core/assets/ProceduralTextures.ts`. Generated keys are idempotent and remain safe fallbacks.

## 7. Debug and browser tests

Call `configureDebug` from a game scene to expose game-specific read-only state and named test actions. Reuse `tests/smoke/support/builtGame.ts` so browser tests exercise the built bundle without depending on a local port.

Do not expose debug-only APIs in production or use debug actions as gameplay implementation.
