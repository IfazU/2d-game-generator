import Phaser from 'phaser';
import {
  createCircleTexture,
  createPolygonTexture,
  createProceduralTexture,
  createRoundedRectTexture,
} from '../../core/assets/ProceduralTextures';
import { configureCamera, shakeCamera } from '../../core/camera/CameraHelpers';
import { BaseGameScene } from '../../core/game/BaseGameScene';
import { CollectibleSystem } from '../../mechanics/collectibles/CollectibleSystem';
import { connectHazards } from '../../mechanics/hazards/HazardSystem';
import { PatrolEnemy } from '../../mechanics/patrol-enemy/PatrolEnemy';
import type { GameSpec } from '../config/GameSpec';
import {
  collectiblePositions,
  enemyDefinitions,
  FINISH_X,
  hazardPositions,
  objectiveCopy,
  platforms,
  REQUIRED_COLLECTIBLES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from './level';

const TEXTURE = {
  player: 'sunny.player',
  ground: 'sunny.ground',
  coin: 'sunny.sun-drop',
  hazard: 'sunny.thorns',
  enemy: 'sunny.crawler',
  finish: 'sunny.windmill',
} as const;

type EnemyEntry = {
  sprite: Phaser.Physics.Arcade.Sprite;
  patrol: PatrolEnemy;
};

export class SunnySpringsScene extends BaseGameScene {
  private readonly spec: GameSpec;
  private collected = 0;
  private enemies: EnemyEntry[] = [];
  private collectibles?: Phaser.Physics.Arcade.StaticGroup;
  private hazards?: Phaser.Physics.Arcade.StaticGroup;
  private finish?: Phaser.Physics.Arcade.Sprite;
  private spawn = { x: 110, y: 440 };
  private lastDamageAt = -Infinity;
  private messageText?: Phaser.GameObjects.Text;

  constructor(spec: GameSpec) {
    super('sunny-springs');
    this.spec = spec;
  }

  create(): void {
    this.collected = 0;
    this.enemies = [];
    this.lastDamageAt = -Infinity;
    this.cameras.main.setBackgroundColor(
      this.spec.presentation?.backgroundColor ?? '#79d7f2',
    );
    this.initialize({
      title: this.spec.title,
      controls:
        this.spec.presentation?.controlsText ??
        '← → / A D move · Space / ↑ / W jump · R restart',
      objective: objectiveCopy(0),
      health: this.spec.gameplay?.health ?? 3,
      hud: this.spec.presentation?.hud,
      input: this.spec.input,
    });
    this.createTextures();
    this.createScenery();
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    const terrain = this.physics.add.staticGroup();
    for (const platform of platforms) {
      const sprite = terrain.create(
        platform.x,
        platform.y,
        TEXTURE.ground,
      ) as Phaser.Physics.Arcade.Sprite;
      sprite.setDisplaySize(platform.width, 30).refreshBody();
    }

    this.player = this.physics.add
      .sprite(this.spawn.x, this.spawn.y, TEXTURE.player)
      .setCollideWorldBounds(false)
      .setGravityY(1100)
      .setBounce(0.02)
      .setDepth(12);
    this.player.setBodySize(30, 42).setOffset(5, 5);
    this.physics.add.collider(this.player, terrain);
    configureCamera(this, this.player, WORLD_WIDTH, WORLD_HEIGHT);

    this.collectibles = this.physics.add.staticGroup();
    for (const point of collectiblePositions)
      this.collectibles.create(point.x, point.y, TEXTURE.coin);
    new CollectibleSystem({
      scene: this,
      player: this.player,
      items: this.collectibles,
      required: REQUIRED_COLLECTIBLES,
      onCollect: (count) => {
        this.collected = count;
        this.session.addScore(this.spec.gameplay?.scorePerCollectible ?? 100);
        this.objective = objectiveCopy(count);
        this.tweens.add({
          targets: this.player,
          scale: 1.08,
          duration: 80,
          yoyo: true,
        });
      },
    });

    this.hazards = this.physics.add.staticGroup();
    for (const point of hazardPositions)
      this.hazards.create(point.x, point.y, TEXTURE.hazard);
    connectHazards(
      this,
      this.player as Phaser.Types.Physics.Arcade.GameObjectWithBody,
      this.hazards,
      () => this.damagePlayer('Ouch — watch for spring thorns!'),
    );

    for (const definition of enemyDefinitions) {
      const sprite = this.physics.add
        .sprite(definition.x, definition.y, TEXTURE.enemy)
        .setGravityY(1100)
        .setDepth(10);
      sprite.setBodySize(38, 28).setOffset(3, 8);
      this.physics.add.collider(sprite, terrain);
      const entry = {
        sprite,
        patrol: new PatrolEnemy(
          sprite,
          definition.min,
          definition.max,
          this.spec.gameplay?.enemySpeed ?? 72,
        ),
      };
      this.enemies.push(entry);
      this.physics.add.overlap(this.player, sprite, () =>
        this.handleEnemyContact(entry),
      );
    }

    this.finish = this.physics.add
      .staticSprite(FINISH_X, 430, TEXTURE.finish)
      .setDepth(8);
    this.physics.add.overlap(this.player, this.finish, () => {
      if (this.collected >= REQUIRED_COLLECTIBLES) this.win();
      else this.showMessage('The windmill needs every sun drop!', '#fff2a8');
    });

    this.configureDebug({
      getState: () => ({
        collected: this.collected,
        required: REQUIRED_COLLECTIBLES,
        enemiesRemaining: this.enemies.filter((entry) => entry.sprite.active)
          .length,
        finishX: FINISH_X,
        cameraX: Math.round(this.cameras.main.scrollX),
      }),
      actions: {
        visitCollectible: () => this.moveToNextCollectible(),
        visitHazard: () => this.teleportTo(hazardPositions[0].x, 450),
        visitEnemy: () => this.moveToActiveEnemy(),
        stompEnemy: () => this.prepareStomp(),
        visitFinish: () => this.teleportTo(FINISH_X - 20, 410),
        loseLife: () => this.damagePlayer('Debug damage'),
      },
    });
  }

  update(_time: number, delta: number): void {
    if (!this.commonUpdate(delta) || !this.player) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const left = this.controls.left.isDown || this.controls.secondary.isDown;
    const right = this.controls.right.isDown || this.controls.primary.isDown;
    this.player.setVelocityX(
      left
        ? -(this.spec.gameplay?.moveSpeed ?? 255)
        : right
          ? (this.spec.gameplay?.moveSpeed ?? 255)
          : 0,
    );
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.controls.jump) ||
      Phaser.Input.Keyboard.JustDown(this.controls.up);
    if (jumpPressed && (body.blocked.down || body.touching.down))
      this.player.setVelocityY(-(this.spec.gameplay?.jumpSpeed ?? 480));
    for (const enemy of this.enemies)
      if (enemy.sprite.active) enemy.patrol.update();
    if (this.player.y > WORLD_HEIGHT + 40)
      this.damagePlayer('Mind the gaps — back to the last safe hill!');
  }

  private createTextures(): void {
    createProceduralTexture(this, {
      key: TEXTURE.player,
      width: 40,
      height: 50,
      draw: ({ graphics }) => {
        graphics.fillStyle(0x254f6e).fillRoundedRect(5, 13, 30, 34, 9);
        graphics.fillStyle(0xffd76d).fillCircle(20, 14, 12);
        graphics.fillStyle(0xffffff).fillCircle(16, 12, 3);
        graphics.fillStyle(0x18354c).fillCircle(17, 12, 1.5);
        graphics.fillStyle(0xf26b5b).fillTriangle(27, 17, 36, 20, 27, 23);
        graphics.fillStyle(0x173653).fillRoundedRect(2, 43, 15, 6, 3);
        graphics.fillRoundedRect(23, 43, 15, 6, 3);
      },
    });
    createRoundedRectTexture(this, {
      key: TEXTURE.ground,
      width: 64,
      height: 30,
      color: 0x8a5a3b,
      radius: 7,
      strokeColor: 0x4d7a47,
      strokeWidth: 5,
    });
    createProceduralTexture(this, {
      key: TEXTURE.coin,
      width: 30,
      height: 34,
      draw: ({ graphics }) => {
        graphics.fillStyle(0xffc83d).fillCircle(15, 17, 14);
        graphics.lineStyle(3, 0xfff3a6).strokeCircle(15, 17, 10);
        graphics.fillStyle(0xfff3a6).fillCircle(15, 17, 4);
      },
    });
    createPolygonTexture(this, {
      key: TEXTURE.hazard,
      width: 60,
      height: 36,
      color: 0xc94155,
      points: [
        { x: 0, y: 36 },
        { x: 10, y: 5 },
        { x: 20, y: 36 },
        { x: 30, y: 2 },
        { x: 40, y: 36 },
        { x: 50, y: 7 },
        { x: 60, y: 36 },
      ],
    });
    createProceduralTexture(this, {
      key: TEXTURE.enemy,
      width: 44,
      height: 40,
      draw: ({ graphics }) => {
        graphics.fillStyle(0x9d4f75).fillRoundedRect(2, 8, 40, 29, 11);
        graphics.fillStyle(0xf7d8a8).fillCircle(13, 18, 5);
        graphics.fillCircle(31, 18, 5);
        graphics.fillStyle(0x26384a).fillCircle(13, 18, 2);
        graphics.fillCircle(31, 18, 2);
        graphics.fillStyle(0x53364b).fillRect(6, 35, 10, 5);
        graphics.fillRect(28, 35, 10, 5);
      },
    });
    createProceduralTexture(this, {
      key: TEXTURE.finish,
      width: 110,
      height: 150,
      draw: ({ graphics }) => {
        graphics.fillStyle(0xf5edcf).fillRoundedRect(38, 42, 42, 106, 6);
        graphics.fillStyle(0x4d7a47).fillTriangle(28, 50, 59, 18, 90, 50);
        graphics.fillStyle(0x254f6e).fillCircle(59, 69, 10);
        graphics.lineStyle(7, 0xf26b5b).lineBetween(59, 69, 59, 8);
        graphics.lineBetween(59, 69, 105, 69);
        graphics.lineBetween(59, 69, 59, 130);
        graphics.lineBetween(59, 69, 13, 69);
        graphics.fillStyle(0x704e39).fillRoundedRect(50, 116, 18, 32, 5);
      },
    });
  }

  private createScenery(): void {
    for (let x = 120; x < WORLD_WIDTH; x += 520) {
      this.add.circle(x, 395, 78, 0x4d9b68, 0.45).setDepth(0);
      this.add.circle(x + 80, 410, 58, 0x72b879, 0.5).setDepth(0);
    }
    for (let x = 260; x < WORLD_WIDTH; x += 780) {
      createCircleTexture(this, {
        key: `sunny.cloud.${x}`,
        diameter: 52,
        color: 0xffffff,
        alpha: 0.75,
      });
      this.add.image(x, 135 + (x % 3) * 24, `sunny.cloud.${x}`).setDepth(0);
      this.add
        .image(x + 35, 142 + (x % 3) * 24, `sunny.cloud.${x}`)
        .setDepth(0);
    }
    this.add
      .text(100, 380, 'SUNNY SPRINGS', {
        fontSize: '22px',
        color: '#173653',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(1);
  }

  private handleEnemyContact(enemy: EnemyEntry): void {
    if (!this.player || !enemy.sprite.active) return;
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const enemyBody = enemy.sprite.body as Phaser.Physics.Arcade.Body;
    const stomping =
      playerBody.velocity.y > 80 && playerBody.bottom < enemyBody.center.y + 8;
    if (stomping) {
      enemy.sprite.disableBody(true, true);
      this.player.setVelocityY(-300);
      this.session.addScore(250);
      this.showMessage('Clockwork crawler bounced! +250', '#fff2a8');
      return;
    }
    this.damagePlayer('A crawler clipped you!');
  }

  private damagePlayer(message: string): void {
    if (!this.player || this.time.now - this.lastDamageAt < 900) return;
    this.lastDamageAt = this.time.now;
    this.session.damage(1);
    shakeCamera(this, 0.012);
    this.showMessage(message, '#ffd1d6');
    if (this.session.snapshot().phase === 'playing') {
      this.player.setPosition(this.spawn.x, this.spawn.y).setVelocity(0, 0);
      this.player.setAlpha(0.45);
      this.tweens.add({ targets: this.player, alpha: 1, duration: 500 });
    }
  }

  private showMessage(text: string, color: string): void {
    this.messageText?.destroy();
    this.messageText = this.add
      .text(480, 104, text, {
        fontSize: '18px',
        color,
        backgroundColor: '#173653dd',
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(105);
    this.time.delayedCall(1400, () => this.messageText?.destroy());
  }

  private teleportTo(x: number, y: number): void {
    this.player?.setPosition(x, y).setVelocity(0, 0);
  }

  private moveToNextCollectible(): void {
    const item = this.collectibles
      ?.getChildren()
      .find((child) => (child as Phaser.GameObjects.GameObject).active) as
      Phaser.Physics.Arcade.Sprite | undefined;
    if (item) this.teleportTo(item.x, item.y);
  }

  private moveToActiveEnemy(): void {
    const enemy = this.enemies.find((entry) => entry.sprite.active)?.sprite;
    if (enemy) this.teleportTo(enemy.x, enemy.y);
  }

  private prepareStomp(): void {
    const enemy = this.enemies.find((entry) => entry.sprite.active)?.sprite;
    if (!enemy || !this.player) return;
    this.player.setPosition(enemy.x, enemy.y - 62).setVelocity(0, 260);
  }
}
