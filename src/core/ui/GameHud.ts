import Phaser from 'phaser';
import type { SessionSnapshot } from '../game/GameSession';

export type HudOptions = {
  showScore?: boolean;
  showHealth?: boolean;
  showObjective?: boolean;
  scoreLabel?: string;
  healthLabel?: string;
  winText?: string;
  loseText?: string;
  restartText?: string;
  panelColor?: number;
  panelAlpha?: number;
  accentColor?: string;
};

export class GameHud {
  private readonly status: Phaser.GameObjects.Text;
  private readonly message: Phaser.GameObjects.Text;
  private readonly options: Required<HudOptions>;
  constructor(
    scene: Phaser.Scene,
    title: string,
    controls: string,
    options: HudOptions = {},
  ) {
    this.options = {
      showScore: true,
      showHealth: true,
      showObjective: true,
      scoreLabel: 'Score',
      healthLabel: 'Health',
      winText: 'You win!',
      loseText: 'Game over',
      restartText: 'Press R or tap to restart',
      panelColor: 0x08111f,
      panelAlpha: 0.84,
      accentColor: '#b9d8ff',
      ...options,
    };
    scene.add
      .rectangle(
        480,
        34,
        960,
        68,
        this.options.panelColor,
        this.options.panelAlpha,
      )
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
      .text(18, 38, controls, {
        fontSize: '13px',
        color: this.options.accentColor,
      })
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
    const metrics: string[] = [];
    if (this.options.showScore)
      metrics.push(`${this.options.scoreLabel} ${snapshot.score}`);
    if (this.options.showHealth)
      metrics.push(`${this.options.healthLabel} ${snapshot.health}`);
    const lines = [metrics.join('  ·  ')];
    if (this.options.showObjective && objective) lines.push(objective);
    this.status.setText(lines.filter(Boolean).join('\n'));
    const done = snapshot.phase === 'won' || snapshot.phase === 'lost';
    this.message
      .setVisible(done)
      .setText(
        done
          ? `${snapshot.phase === 'won' ? this.options.winText : this.options.loseText}\n${this.options.restartText}`
          : '',
      );
  }
}
