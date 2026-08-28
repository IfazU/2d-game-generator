import Phaser from 'phaser';
export class ChaseEnemy {
  constructor(
    private readonly sprite: Phaser.Physics.Arcade.Sprite,
    private readonly target: Phaser.GameObjects.Components.Transform,
    private readonly speed = 90,
    private readonly range = 280,
  ) {}
  update(): void {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.target.x,
      this.target.y,
    );
    if (distance > this.range) return void this.sprite.setVelocity(0);
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      this.target.x,
      this.target.y,
    );
    this.sprite.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed,
    );
  }
}
