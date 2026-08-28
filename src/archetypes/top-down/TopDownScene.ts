import Phaser from 'phaser';
import { TEXTURES } from '../../core/assets/PlaceholderAssets';
import { configureCamera, shakeCamera } from '../../core/camera/CameraHelpers';
import { BaseGameScene } from '../../core/game/BaseGameScene';
import { ChaseEnemy } from '../../mechanics/chase-enemy/ChaseEnemy';
import { CollectibleSystem } from '../../mechanics/collectibles/CollectibleSystem';
import { ProjectileSystem } from '../../mechanics/projectile-shooting/ProjectileSystem';
import {
  normalizeArchetypeOptions,
  type CommonArchetypeOptions,
} from '../ArchetypeOptions';

export type TopDownOptions = CommonArchetypeOptions & {
  moveSpeed?: number;
  enemySpeed?: number;
  chaseRange?: number;
  projectileSpeed?: number;
  projectileCooldown?: number;
  hitInvulnerabilityMs?: number;
};

export class TopDownScene extends BaseGameScene {
  private chasers: ChaseEnemy[] = [];
  private shooting!: ProjectileSystem;
  private lastHit = -1000;
  private readonly options: TopDownOptions;
  constructor(options?: string | TopDownOptions) {
    super('top-down');
    this.options = normalizeArchetypeOptions(options);
  }
  create(): void {
    this.chasers = [];
    this.lastHit = -1000;
    this.cameras.main.setBackgroundColor(
      this.options.backgroundColor ?? '#163b2c',
    );
    this.initialize({
      title: this.options.title ?? 'Top-Down Adventure',
      controls:
        this.options.controlsText ?? 'Arrows move · X shoots · R restarts',
      objective: this.options.objective ?? 'Collect all 6 crystals',
      health: this.options.health ?? 4,
      hud: this.options.hud,
      input: this.options.input,
    });
    this.physics.world.setBounds(0, 0, 1400, 900);
    this.player = this.physics.add
      .sprite(180, 180, TEXTURES.player)
      .setCollideWorldBounds(true);
    configureCamera(this, this.player, 1400, 900);
    for (let x = 100; x < 1400; x += 160)
      this.add.circle(x, 80 + ((x * 7) % 740), 4, 0x86efac, 0.45);
    const items = this.physics.add.staticGroup();
    for (const point of [
      [350, 180],
      [720, 140],
      [1120, 260],
      [330, 650],
      [760, 720],
      [1240, 690],
    ])
      items.create(point[0], point[1], TEXTURES.collectible);
    new CollectibleSystem({
      scene: this,
      player: this.player,
      items,
      required: 6,
      onCollect: (count) => {
        this.session.addScore(10);
        this.objective = `${this.options.objective ?? 'Collect all 6 crystals'} (${count}/6)`;
      },
      onComplete: () => this.win(),
    });
    const enemies = this.physics.add.group();
    for (const point of [
      [600, 380],
      [980, 520],
      [1150, 760],
    ]) {
      const enemy = enemies.create(
        point[0],
        point[1],
        TEXTURES.enemy,
      ) as Phaser.Physics.Arcade.Sprite;
      enemy.setCollideWorldBounds(true);
      this.chasers.push(
        new ChaseEnemy(
          enemy,
          this.player,
          this.options.enemySpeed ?? 105,
          this.options.chaseRange ?? 420,
        ),
      );
    }
    this.physics.add.overlap(this.player, enemies, () => {
      if (
        this.time.now - this.lastHit <
        (this.options.hitInvulnerabilityMs ?? 800)
      )
        return;
      this.lastHit = this.time.now;
      this.session.damage(1);
      shakeCamera(this);
    });
    this.shooting = new ProjectileSystem(this, {
      texture: TEXTURES.projectile,
      speed: this.options.projectileSpeed ?? 500,
      cooldown: this.options.projectileCooldown ?? 220,
    });
    this.physics.add.overlap(this.shooting.group, enemies, (shot, enemy) => {
      (shot as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
      (enemy as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
      this.session.addScore(20);
    });
  }
  update(_time: number, delta: number): void {
    if (!this.commonUpdate(delta) || !this.player) return;
    const x =
      (this.controls.right.isDown ? 1 : 0) -
      (this.controls.left.isDown ? 1 : 0);
    const y =
      (this.controls.down.isDown ? 1 : 0) - (this.controls.up.isDown ? 1 : 0);
    const direction = new Phaser.Math.Vector2(x, y)
      .normalize()
      .scale(this.options.moveSpeed ?? 220);
    this.player.setVelocity(direction.x, direction.y);
    if (Phaser.Input.Keyboard.JustDown(this.controls.primary)) {
      const pointer = this.input.activePointer;
      const world = pointer.positionToCamera(
        this.cameras.main,
      ) as Phaser.Math.Vector2;
      this.shooting.fire(
        this.player.x,
        this.player.y,
        Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          world.x,
          world.y,
        ),
      );
    }
    this.chasers.forEach((chaser) => chaser.update());
  }
}
