import Phaser from 'phaser';
import type { SessionSnapshot } from '../game/GameSession';
export class GameHud {
  private readonly status: Phaser.GameObjects.Text;
  private readonly message: Phaser.GameObjects.Text;
  constructor(scene: Phaser.Scene, title: string, controls: string) {
    scene.add
      .rectangle(480, 34, 960, 68, 0x08111f, 0.84)
      .setScrollFactor(0)
      .setDepth(100);
    scene.add
      .text(18, 10, title, {
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(101);
    scene.add
      .text(18, 38, controls, { fontSize: '13px', color: '#b9d8ff' })
      .setScrollFactor(0)
      .setDepth(101);
    this.status = scene.add
      .text(940, 18, '', { fontSize: '16px', color: '#ffffff', align: 'right' })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(101);
    this.message = scene.add
      .text(480, 270, '', {
        fontSize: '36px',
        color: '#ffffff',
        align: 'center',
        backgroundColor: '#08111fee',
        padding: { x: 30, y: 20 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(110)
      .setVisible(false);
  }
  update(snapshot: SessionSnapshot, objective: string): void {
    this.status.setText(
      `Score ${snapshot.score}  ·  Health ${snapshot.health}\n${objective}`,
    );
    const done = snapshot.phase === 'won' || snapshot.phase === 'lost';
    this.message
      .setVisible(done)
      .setText(
        done
          ? `${snapshot.phase === 'won' ? 'You win!' : 'Game over'}\nPress R or tap to restart`
          : '',
      );
  }
}
