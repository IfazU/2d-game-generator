import Phaser from 'phaser';
import { BaseGameScene } from '../../core/game/BaseGameScene';
import { shakeCamera } from '../../core/camera/CameraHelpers';
import { connectHazards } from '../../mechanics/hazards/HazardSystem';
import {
  DRAGON_X,
  gapCenterFor,
  hasPassedDragon,
  isOutsidePlayableArea,
  PLAYABLE_BOTTOM,
  PLAYABLE_TOP,
  VOLCANO_GAP,
  VOLCANO_SPACING,
  VOLCANO_WIDTH,
} from './DragonVolcanoRules';

const DRAGON_TEXTURE = 'dragon.player';
const VOLCANO_TEXTURE = 'volcano.column';
const FLAME_TEXTURE = 'volcano.flame';

type VolcanoPair = {
  top: Phaser.Physics.Arcade.Sprite;
  bottom: Phaser.Physics.Arcade.Sprite;
  scored: boolean;
};

export class DragonVolcanoScene extends BaseGameScene {
  private volcanoes!: Phaser.Physics.Arcade.Group;
  private pairs: VolcanoPair[] = [];
  private spawnIndex = 0;
  private wingTime = 0;
  private pointerHeld = false;

  constructor() {
    super('dragon-volcano-flap');
  }

  create(): void {
    this.pairs = [];
    this.spawnIndex = 0;
    this.wingTime = 0;
    this.pointerHeld = false;
    this.cameras.main.setBackgroundColor('#170b22');
    this.initialize(
      'EMBERWING · VOLCANO FLIGHT',
      'Space / tap to flap · R restarts',
      'Fly through the next volcanic gate',
      1,
    );
    this.createGeneratedTextures();
    this.createVolcanicBackdrop();
    this.physics.world.gravity.y = 880;

    this.player = this.physics.add
      .sprite(DRAGON_X, 285, DRAGON_TEXTURE)
      .setDepth(30)
      .setScale(0.82)
      .setAngle(-8);
    this.player.setSize(44, 30).setOffset(15, 15);

    this.volcanoes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    for (let i = 0; i < 4; i += 1) {
      this.createVolcanoPair(790 + i * VOLCANO_SPACING);
    }
    connectHazards(
      this,
      this.player as Phaser.Types.Physics.Arcade.GameObjectWithBody,
      this.volcanoes,
      () => this.endRun(),
    );

    this.add.rectangle(480, PLAYABLE_TOP, 960, 7, 0xff6b1a, 0.65).setDepth(20);
    this.add.rectangle(480, PLAYABLE_BOTTOM, 960, 36, 0xe83b16).setDepth(20);
    for (let x = 10; x < 960; x += 34) {
      this.add
        .image(x, PLAYABLE_BOTTOM - 17, FLAME_TEXTURE)
        .setScale(0.65 + ((x / 34) % 3) * 0.08)
        .setDepth(21);
    }
  }

  update(time: number, delta: number): void {
    if (!this.commonUpdate(delta) || !this.player) return;

    const pointerDown = this.input.activePointer.leftButtonDown();
    const flap =
      Phaser.Input.Keyboard.JustDown(this.controls.jump) ||
      (pointerDown && !this.pointerHeld);
    this.pointerHeld = pointerDown;
    if (flap) {
      this.player.setVelocityY(-345);
      this.player.setAngle(-18);
    }

    this.player.setX(DRAGON_X);
    this.player.setAngle(
      Phaser.Math.Linear(
        this.player.angle,
        this.player.body!.velocity.y > 0 ? 22 : -12,
        0.08,
      ),
    );
    this.wingTime += delta;
    this.player.setScale(0.82, 0.82 + Math.sin(this.wingTime / 85) * 0.035);

    const speed = 175 + Math.min(this.session.snapshot().score * 4, 55);
    let furthestX = Math.max(...this.pairs.map((pair) => pair.top.x));
    for (const pair of this.pairs) {
      pair.top.x -= (speed * delta) / 1000;
      pair.bottom.x = pair.top.x;
      pair.top.body?.updateFromGameObject();
      pair.bottom.body?.updateFromGameObject();

      if (hasPassedDragon(pair.top.x, pair.scored)) {
        pair.scored = true;
        this.session.addScore(1);
        this.cameras.main.flash(80, 255, 130, 35, false);
      }
      if (pair.top.x < -VOLCANO_WIDTH) {
        furthestX += VOLCANO_SPACING;
        this.placePair(pair, furthestX, gapCenterFor(this.spawnIndex++));
      }
    }

    this.objective = `Volcanic gates cleared · ${this.session.snapshot().score}`;
    const halfHeight = this.player.displayHeight * 0.3;
    if (isOutsidePlayableArea(this.player.y, halfHeight)) this.endRun();

    const ember = this.add
      .circle(this.player.x - 31, this.player.y + 4, 3, 0xffc247, 0.9)
      .setDepth(25);
    this.tweens.add({
      targets: ember,
      x: ember.x - 38,
      alpha: 0,
      scale: 0.2,
      duration: 330,
      onComplete: () => ember.destroy(),
    });
  }

  private createVolcanoPair(x: number): void {
    const top = this.volcanoes.create(
      x,
      0,
      VOLCANO_TEXTURE,
    ) as Phaser.Physics.Arcade.Sprite;
    const bottom = this.volcanoes.create(
      x,
      0,
      VOLCANO_TEXTURE,
    ) as Phaser.Physics.Arcade.Sprite;
    top.setFlipY(true).setDepth(15);
    bottom.setDepth(15);
    this.pairs.push({ top, bottom, scored: false });
    this.placePair(
      this.pairs[this.pairs.length - 1],
      x,
      gapCenterFor(this.spawnIndex++),
    );
  }

  private placePair(pair: VolcanoPair, x: number, center: number): void {
    const columnHeight = 380;
    pair.top.setPosition(x, center - VOLCANO_GAP / 2 - columnHeight / 2);
    pair.bottom.setPosition(x, center + VOLCANO_GAP / 2 + columnHeight / 2);
    pair.top
      .setDisplaySize(VOLCANO_WIDTH, columnHeight)
      .setActive(true)
      .setVisible(true);
    pair.bottom
      .setDisplaySize(VOLCANO_WIDTH, columnHeight)
      .setActive(true)
      .setVisible(true);
    pair.top.setSize(88, 360).setOffset(12, 10);
    pair.bottom.setSize(88, 360).setOffset(12, 10);
    pair.top.body?.updateFromGameObject();
    pair.bottom.body?.updateFromGameObject();
    pair.scored = false;
  }

  private endRun(): void {
    if (this.session.snapshot().phase !== 'playing') return;
    shakeCamera(this);
    this.lose();
    if (this.player) {
      this.player.setVelocity(0, 0);
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
    }
  }

  private createGeneratedTextures(): void {
    if (!this.textures.exists(DRAGON_TEXTURE)) {
      const dragon = this.make.graphics({ x: 0, y: 0 });
      dragon.fillStyle(0xffb21c).fillTriangle(8, 34, 28, 8, 34, 34);
      dragon.fillStyle(0xf25b22).fillTriangle(23, 30, 35, 7, 45, 32);
      dragon.fillStyle(0x8d2f24).fillEllipse(40, 34, 58, 34);
      dragon.fillStyle(0xe54b22).fillCircle(65, 27, 16);
      dragon.fillTriangle(57, 16, 61, 3, 67, 17);
      dragon.fillTriangle(68, 16, 75, 5, 76, 22);
      dragon.fillStyle(0xffdf69).fillCircle(70, 24, 4);
      dragon.fillStyle(0x2b1017).fillCircle(71, 24, 2);
      dragon.fillStyle(0xff6b1a).fillTriangle(9, 31, 0, 23, 2, 39);
      dragon.generateTexture(DRAGON_TEXTURE, 84, 64);
      dragon.destroy();
    }
    if (!this.textures.exists(VOLCANO_TEXTURE)) {
      const volcano = this.make.graphics({ x: 0, y: 0 });
      volcano.fillStyle(0x321c2b).fillRect(0, 0, 112, 380);
      volcano.fillStyle(0x4d2630).fillTriangle(0, 0, 20, 45, 34, 0);
      volcano.fillTriangle(28, 0, 48, 30, 67, 0);
      volcano.fillTriangle(58, 0, 83, 52, 112, 0);
      volcano.fillStyle(0x751f28).fillRect(10, 32, 10, 348);
      volcano.fillRect(78, 44, 8, 336);
      volcano.fillStyle(0xff5b1a).fillRect(14, 32, 4, 348);
      volcano.fillRect(80, 44, 3, 336);
      volcano.fillStyle(0xe53d18).fillEllipse(56, 6, 108, 25);
      volcano.fillStyle(0xffb11b).fillEllipse(56, 6, 78, 13);
      volcano.generateTexture(VOLCANO_TEXTURE, 112, 380);
      volcano.destroy();
    }
    if (!this.textures.exists(FLAME_TEXTURE)) {
      const flame = this.make.graphics({ x: 0, y: 0 });
      flame.fillStyle(0xff6b1a).fillTriangle(0, 28, 12, 0, 24, 28);
      flame.fillStyle(0xffd64a).fillTriangle(7, 28, 13, 10, 18, 28);
      flame.generateTexture(FLAME_TEXTURE, 24, 28);
      flame.destroy();
    }
  }

  private createVolcanicBackdrop(): void {
    this.add.rectangle(480, 300, 960, 460, 0x2b1233);
    this.add.circle(770, 160, 105, 0xc22f25, 0.3);
    this.add.circle(770, 160, 72, 0xff7a28, 0.17);
    for (const [x, y, width, height] of [
      [105, 470, 300, 180],
      [390, 480, 390, 250],
      [710, 475, 330, 205],
      [930, 490, 260, 150],
    ] as const) {
      this.add
        .triangle(x, y, 0, height, width / 2, 0, width, height, 0x180d1c, 0.9)
        .setOrigin(0.5, 1);
    }
    for (let i = 0; i < 22; i += 1) {
      this.add.circle(
        (i * 149 + 37) % 960,
        95 + ((i * 71) % 360),
        1 + (i % 3),
        0xff9138,
        0.25 + (i % 4) * 0.08,
      );
    }
  }
}
