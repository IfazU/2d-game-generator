import Phaser from 'phaser';
import { TEXTURES } from '../../core/assets/PlaceholderAssets';
import { configureCamera, shakeCamera } from '../../core/camera/CameraHelpers';
import { BaseGameScene } from '../../core/game/BaseGameScene';

export class RunnerScene extends BaseGameScene {
  private lastDistance = 0;
  constructor(private readonly gameTitle = 'Endless-Style Runner') {
    super('runner');
  }
  create(): void {
    this.lastDistance = 0;
    this.cameras.main.setBackgroundColor('#312e81');
    this.initialize(
      this.gameTitle,
      'Space jumps · ↓ fast-falls · R restarts',
      'Reach the finish at 4,600m',
      1,
    );
    this.physics.world.setBounds(0, 0, 5000, 540);
    const ground = this.physics.add.staticGroup();
    for (let x = 32; x < 5000; x += 64)
      ground.create(x, 520, TEXTURES.platform);
    this.player = this.physics.add
      .sprite(120, 455, TEXTURES.player)
      .setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);
    configureCamera(this, this.player, 5000, 540);
    this.cameras.main.setFollowOffset(-220, 0);
    const obstacles = this.physics.add.staticGroup();
    for (const x of [
      650, 1050, 1380, 1780, 2050, 2450, 2720, 3100, 3370, 3650, 3940, 4200,
    ])
      obstacles.create(x, 480, TEXTURES.hazard);
    this.physics.add.overlap(this.player, obstacles, () => {
      shakeCamera(this);
      this.lose();
    });
    const items = this.physics.add.staticGroup();
    for (const x of [420, 880, 1220, 1600, 2250, 2900, 3500, 4070, 4450])
      items.create(x, 415, TEXTURES.collectible);
    this.physics.add.overlap(this.player, items, (_player, item) => {
      (item as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
      this.session.addScore(25);
    });
    this.add.rectangle(4650, 370, 18, 290, 0x34d399, 0.8);
  }
  update(_time: number, delta: number): void {
    if (!this.commonUpdate(delta) || !this.player) return;
    const speed = 190 + Math.min(130, this.player.x / 24);
    this.player.setVelocityX(speed);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (Phaser.Input.Keyboard.JustDown(this.controls.jump) && body.blocked.down)
      this.player.setVelocityY(-430);
    if (this.controls.down.isDown && !body.blocked.down)
      this.player.setVelocityY(520);
    const distance = Math.floor(this.player.x / 10);
    if (distance > this.lastDistance) {
      this.session.addScore(distance - this.lastDistance);
      this.lastDistance = distance;
    }
    this.objective = `Reach the finish · ${distance}m`;
    if (this.player.x >= 4600) this.win();
  }
}
