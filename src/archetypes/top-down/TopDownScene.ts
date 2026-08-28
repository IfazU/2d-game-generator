import Phaser from 'phaser';
import { TEXTURES } from '../../core/assets/PlaceholderAssets';
import { configureCamera, shakeCamera } from '../../core/camera/CameraHelpers';
import { BaseGameScene } from '../../core/game/BaseGameScene';
import { ChaseEnemy } from '../../mechanics/chase-enemy/ChaseEnemy';
import { CollectibleSystem } from '../../mechanics/collectibles/CollectibleSystem';
import { ProjectileSystem } from '../../mechanics/projectile-shooting/ProjectileSystem';

export class TopDownScene extends BaseGameScene {
  private chasers: ChaseEnemy[] = [];
  private shooting!: ProjectileSystem;
  private lastHit = -1000;
  constructor(private readonly gameTitle = 'Top-Down Adventure') {
    super('top-down');
  }
  create(): void {
    this.chasers = [];
    this.lastHit = -1000;
    this.cameras.main.setBackgroundColor('#163b2c');
    this.initialize(
      this.gameTitle,
      'Arrows move · X shoots · R restarts',
      'Collect all 6 crystals',
      4,
    );
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
        this.objective = `Collect all 6 crystals (${count}/6)`;
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
      this.chasers.push(new ChaseEnemy(enemy, this.player, 105, 420));
    }
    this.physics.add.overlap(this.player, enemies, () => {
      if (this.time.now - this.lastHit < 800) return;
      this.lastHit = this.time.now;
      this.session.damage(1);
      shakeCamera(this);
    });
    this.shooting = new ProjectileSystem(this, {
      texture: TEXTURES.projectile,
      speed: 500,
      cooldown: 220,
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
    const direction = new Phaser.Math.Vector2(x, y).normalize().scale(220);
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
