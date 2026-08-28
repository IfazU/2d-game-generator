import Phaser from 'phaser';
import './style.css';

class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }
  create(): void {
    this.cameras.main.setBackgroundColor('#17213a');
    this.add.text(480, 230, 'Agent-First 2D Game Kit', { fontSize: '34px', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(480, 290, 'Foundation ready', { fontSize: '20px', color: '#9ee7ff' }).setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#17213a',
  scene: [BootScene],
});
