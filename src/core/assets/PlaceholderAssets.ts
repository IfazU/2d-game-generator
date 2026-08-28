import Phaser from 'phaser';
import { createRoundedRectTexture } from './ProceduralTextures';
export const TEXTURES = {
  player: 'character.default',
  enemy: 'enemy.default',
  collectible: 'collectible.coin',
  platform: 'environment.platform',
  hazard: 'environment.hazard',
  projectile: 'projectile.default',
  powerup: 'powerup.default',
} as const;
function rectangle(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  color: number,
): void {
  createRoundedRectTexture(scene, { key, width, height, color });
}
export function createPlaceholderAssets(scene: Phaser.Scene): void {
  rectangle(scene, TEXTURES.player, 32, 42, 0x60a5fa);
  rectangle(scene, TEXTURES.enemy, 34, 34, 0xf87171);
  rectangle(scene, TEXTURES.collectible, 18, 18, 0xfacc15);
  rectangle(scene, TEXTURES.platform, 64, 20, 0x65a30d);
  rectangle(scene, TEXTURES.hazard, 36, 28, 0xef4444);
  rectangle(scene, TEXTURES.projectile, 12, 8, 0xfef08a);
  rectangle(scene, TEXTURES.powerup, 22, 22, 0xc084fc);
}
