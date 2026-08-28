import Phaser from 'phaser';
export function configureCamera(
  scene: Phaser.Scene,
  target: Phaser.GameObjects.GameObject,
  width: number,
  height: number,
): void {
  scene.cameras.main.setBounds(0, 0, width, height);
  scene.cameras.main.startFollow(target, true, 0.1, 0.1);
  scene.cameras.main.setDeadzone(160, 100);
}
export function shakeCamera(scene: Phaser.Scene, intensity = 0.008): void {
  scene.cameras.main.shake(120, intensity);
}
