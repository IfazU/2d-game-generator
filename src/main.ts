import Phaser from 'phaser';
import { SandboxScene } from './archetypes/sandbox/SandboxScene';
import { PlatformerScene } from './archetypes/platformer/PlatformerScene';
import { TopDownScene } from './archetypes/top-down/TopDownScene';
import { RunnerScene } from './archetypes/runner/RunnerScene';
import { examples } from './game/config/examples';
import { DragonVolcanoScene } from './game/dragon-volcano/DragonVolcanoScene';
import './style.css';

const requested =
  new URLSearchParams(location.search).get('archetype') ?? 'platformer';
const exampleId = new URLSearchParams(location.search).get('example');
const example = exampleId ? examples[exampleId] : undefined;
const selected = example?.archetype ?? requested;
const isDragonGame =
  new URLSearchParams(location.search).get('game') === 'dragon-volcano-flap' ||
  (!location.search && !exampleId);
const scene = isDragonGame
  ? new DragonVolcanoScene()
  : selected === 'sandbox'
    ? new SandboxScene()
    : selected === 'top-down'
      ? new TopDownScene(example?.title)
      : selected === 'runner'
        ? new RunnerScene(example?.title)
        : new PlatformerScene(example?.title);
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
