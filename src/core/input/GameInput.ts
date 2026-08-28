import Phaser from 'phaser';
export type GameControls = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
  primary: Phaser.Input.Keyboard.Key;
  secondary: Phaser.Input.Keyboard.Key;
  restart: Phaser.Input.Keyboard.Key;
};
export type GameAction = keyof GameControls;
export type InputBindings = Partial<Record<GameAction, number>>;

export const DEFAULT_INPUT_BINDINGS: Record<GameAction, number> = {
  left: Phaser.Input.Keyboard.KeyCodes.LEFT,
  right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
  up: Phaser.Input.Keyboard.KeyCodes.UP,
  down: Phaser.Input.Keyboard.KeyCodes.DOWN,
  jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
  primary: Phaser.Input.Keyboard.KeyCodes.X,
  secondary: Phaser.Input.Keyboard.KeyCodes.Z,
  restart: Phaser.Input.Keyboard.KeyCodes.R,
};

export function createGameControls(
  scene: Phaser.Scene,
  bindings: InputBindings = {},
): GameControls {
  const keyboard = scene.input.keyboard;
  if (!keyboard) throw new Error('Keyboard input is unavailable.');
  const keys = { ...DEFAULT_INPUT_BINDINGS, ...bindings };
  return {
    left: keyboard.addKey(keys.left),
    right: keyboard.addKey(keys.right),
    up: keyboard.addKey(keys.up),
    down: keyboard.addKey(keys.down),
    jump: keyboard.addKey(keys.jump),
    primary: keyboard.addKey(keys.primary),
    secondary: keyboard.addKey(keys.secondary),
    restart: keyboard.addKey(keys.restart),
  };
}
