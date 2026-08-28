import Phaser from 'phaser';
import { SandboxScene } from './archetypes/sandbox/SandboxScene';
import { PlatformerScene } from './archetypes/platformer/PlatformerScene';
import './style.css';

const requested = new URLSearchParams(location.search).get('archetype') ?? 'platformer';
const scene = requested === 'sandbox' ? SandboxScene : PlatformerScene;
new Phaser.Game({
  type: Phaser.AUTO, parent: 'game-container', width: 960, height: 540,
  backgroundColor: '#17213a', physics: { default: 'arcade', arcade: { debug: false } },
  scene: [scene], scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
});
