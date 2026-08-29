import Phaser from 'phaser';
import { TEXTURES } from '../../core/assets/PlaceholderAssets';
import { configureCamera, shakeCamera } from '../../core/camera/CameraHelpers';
import { BaseGameScene } from '../../core/game/BaseGameScene';
import {
  normalizeArchetypeOptions,
  type CommonArchetypeOptions,
} from '../ArchetypeOptions';

export type PlatformerOptions = CommonArchetypeOptions & {
  moveSpeed?: number;
  jumpSpeed?: number;
  gravityY?: number;
  enemySpeed?: number;
  scorePerCollectible?: number;
};

export class PlatformerScene extends BaseGameScene {
  private collected = 0;
  private readonly options: PlatformerOptions;
  constructor(options?: string | PlatformerOptions) {
    super('platformer');
    this.options = normalizeArchetypeOptions(options);
  }
  create(): void {
    this.collected = 0;
    this.cameras.main.setBackgroundColor(
      this.options.backgroundColor ?? '#7dd3fc',
    );
    this.initialize({
      title: this.options.title ?? 'Platformer',
      controls:
        this.options.controlsText ?? '← → move · Space jumps · R restarts',
      objective: this.options.objective ?? 'Collect all 5 stars',
      health: this.options.health,
      hud: this.options.hud,
      input: this.options.input,
    });
    this.physics.world.setBounds(0, 0, 1800, 540);
    const platforms = this.physics.add.staticGroup();
    for (const [x, y, width] of [
      [300, 515, 600],
      [840, 440, 200],
      [1140, 360, 220],
      [1510, 490, 500],
    ] as const) {
      const platform = platforms.create(
        x,
        y,
        TEXTURES.platform,
      ) as Phaser.Physics.Arcade.Sprite;
      platform.setDisplaySize(width, 28).refreshBody();
    }
    this.player = this.physics.add
      .sprite(120, 450, TEXTURES.player)
      .setCollideWorldBounds(true)
      .setBounce(0.05)
      .setGravityY(this.options.gravityY ?? 1000);
    this.physics.add.collider(this.player, platforms);
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
    configureCamera(this, this.player, 1800, 540);
    const items = this.physics.add.staticGroup();
    for (const [x, y] of [
      [260, 460],
      [760, 390],
      [1120, 310],
      [1420, 430],
      [1660, 430],
    ])
      items.create(x, y, TEXTURES.collectible);
    this.physics.add.overlap(this.player, items, (_player, item) => {
      (item as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
      this.collected += 1;
      this.session.addScore(this.options.scorePerCollectible ?? 10);
      this.objective = `${this.options.objective ?? 'Collect all 5 stars'} (${this.collected}/5)`;
      if (this.collected === 5) this.win();
    });
    const hazards = this.physics.add.staticGroup();
    hazards.create(520, 475, TEXTURES.hazard);
    hazards.create(1320, 470, TEXTURES.hazard);
    this.physics.add.overlap(this.player, hazards, () => {
      shakeCamera(this);
      this.lose();
    });
    const enemy = this.physics.add
      .sprite(1020, 300, TEXTURES.enemy)
      .setVelocityX(this.options.enemySpeed ?? 80)
      .setBounce(1)
      .setCollideWorldBounds(true)
      .setGravityY(this.options.gravityY ?? 1000);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.overlap(this.player, enemy, () => this.lose());
  }
  update(_time: number, delta: number): void {
    if (!this.commonUpdate(delta) || !this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    this.player.setVelocityX(
      this.controls.left.isDown
        ? -(this.options.moveSpeed ?? 230)
        : this.controls.right.isDown
          ? (this.options.moveSpeed ?? 230)
          : 0,
    );
    if (
      Phaser.Input.Keyboard.JustDown(this.controls.jump) &&
      (body.blocked.down || body.touching.down)
    )
      this.player.setVelocityY(-(this.options.jumpSpeed ?? 430));
    if (this.player.y > 535) this.lose();
  }
}
