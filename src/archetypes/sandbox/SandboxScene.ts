import { TEXTURES } from '../../core/assets/PlaceholderAssets';
import { BaseGameScene } from '../../core/game/BaseGameScene';
export class SandboxScene extends BaseGameScene {
  constructor() {
    super('sandbox');
  }
  create(): void {
    this.cameras.main.setBackgroundColor('#17213a');
    this.initialize(
      'Core Sandbox',
      'Arrow keys move · R restarts',
      'Move the player',
    );
    this.player = this.physics.add
      .sprite(480, 300, TEXTURES.player)
      .setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 68, 960, 472);
  }
  update(_time: number, delta: number): void {
    if (!this.commonUpdate(delta) || !this.player) return;
    this.player.setVelocity(0);
    if (this.controls.left.isDown) this.player.setVelocityX(-220);
    if (this.controls.right.isDown) this.player.setVelocityX(220);
    if (this.controls.up.isDown) this.player.setVelocityY(-220);
    if (this.controls.down.isDown) this.player.setVelocityY(220);
  }
}
