import Phaser from 'phaser';
import { SandboxScene } from './archetypes/sandbox/SandboxScene';
import './style.css';

new Phaser.Game({
  type: Phaser.AUTO, parent: 'game-container', width: 960, height: 540,
  backgroundColor: '#17213a', physics: { default: 'arcade', arcade: { debug: false } },
  scene: [SandboxScene], scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
});
