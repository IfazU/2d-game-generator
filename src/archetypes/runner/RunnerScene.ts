import Phaser from 'phaser';
import { TEXTURES } from '../../core/assets/PlaceholderAssets';
import { configureCamera, shakeCamera } from '../../core/camera/CameraHelpers';
import { BaseGameScene } from '../../core/game/BaseGameScene';
import {
  normalizeArchetypeOptions,
  type CommonArchetypeOptions,
} from '../ArchetypeOptions';

export type RunnerOptions = CommonArchetypeOptions & {
  baseSpeed?: number;
  maxSpeedBonus?: number;
  accelerationDistance?: number;
  jumpSpeed?: number;
  gravityY?: number;
  fastFallSpeed?: number;
  finishX?: number;
};

export class RunnerScene extends BaseGameScene {
  private lastDistance = 0;
  private readonly options: RunnerOptions;
  constructor(options?: string | RunnerOptions) {
    super('runner');
    this.options = normalizeArchetypeOptions(options);
  }
  create(): void {
    this.lastDistance = 0;
    this.cameras.main.setBackgroundColor(
      this.options.backgroundColor ?? '#312e81',
    );
    this.initialize({
      title: this.options.title ?? 'Endless-Style Runner',
      controls:
        this.options.controlsText ?? 'Space jumps · ↓ fast-falls · R restarts',
      objective: this.options.objective ?? 'Reach the finish at 4,600m',
      health: this.options.health ?? 1,
      hud: this.options.hud,
      input: this.options.input,
    });
    this.physics.world.setBounds(0, 0, 5000, 540);
    const ground = this.physics.add.staticGroup();
    for (let x = 32; x < 5000; x += 64)
      ground.create(x, 520, TEXTURES.platform);
    this.player = this.physics.add
      .sprite(120, 455, TEXTURES.player)
      .setCollideWorldBounds(true)
      .setGravityY(this.options.gravityY ?? 1000);
    this.physics.add.collider(this.player, ground);
    this.configureDebug({
      getState: () => {
        const body = this.player?.body as
          Phaser.Physics.Arcade.Body | undefined;
        return {
          grounded: Boolean(body?.blocked.down || body?.touching.down),
          verticalVelocity: body?.velocity.y ?? 0,
        };
      },
    });
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
    const speed =
      (this.options.baseSpeed ?? 190) +
      Math.min(
        this.options.maxSpeedBonus ?? 130,
        this.player.x / (this.options.accelerationDistance ?? 24),
      );
    this.player.setVelocityX(speed);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (
      Phaser.Input.Keyboard.JustDown(this.controls.jump) &&
      (body.blocked.down || body.touching.down)
    )
      this.player.setVelocityY(-(this.options.jumpSpeed ?? 430));
    if (this.controls.down.isDown && !body.blocked.down)
      this.player.setVelocityY(this.options.fastFallSpeed ?? 520);
    const distance = Math.floor(this.player.x / 10);
    if (distance > this.lastDistance) {
      this.session.addScore(distance - this.lastDistance);
      this.lastDistance = distance;
    }
    this.objective = `${this.options.objective ?? 'Reach the finish'} · ${distance}m`;
    if (this.player.x >= (this.options.finishX ?? 4600)) this.win();
  }
}
