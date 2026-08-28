import Phaser from 'phaser';
export class PatrolEnemy {
  private direction = 1;
  constructor(
    private readonly sprite: Phaser.Physics.Arcade.Sprite,
    private readonly min: number,
    private readonly max: number,
    private readonly speed = 80,
  ) {}
  update(): void {
    if (this.sprite.x <= this.min) this.direction = 1;
    if (this.sprite.x >= this.max) this.direction = -1;
    this.sprite.setVelocityX(this.speed * this.direction);
  }
}
