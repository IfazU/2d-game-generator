import Phaser from 'phaser';
import { createDefaultCatalog } from './game/catalog/defaultCatalog';
import { selectGameId } from './game/catalog/GameCatalog';
import { gameSpec } from './game/config/GameSpec';
import './style.css';

const catalog = createDefaultCatalog();
const selectedId = selectGameId(location.search, gameSpec.id);
const scene = catalog.require(selectedId).createScene();
new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#17213a',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [scene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
});
