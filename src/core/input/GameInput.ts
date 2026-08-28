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
export function createGameControls(scene: Phaser.Scene): GameControls {
  const keyboard = scene.input.keyboard;
  if (!keyboard) throw new Error('Keyboard input is unavailable.');
  const cursors = keyboard.createCursorKeys();
  return {
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    jump: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    primary: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X),
    secondary: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
    restart: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
  };
}
