import { PlatformerScene } from '../../archetypes/platformer/PlatformerScene';
import { RunnerScene } from '../../archetypes/runner/RunnerScene';
import { SandboxScene } from '../../archetypes/sandbox/SandboxScene';
import { TopDownScene } from '../../archetypes/top-down/TopDownScene';
import { examples } from '../config/examples';
import { GameCatalog } from './GameCatalog';

export function createDefaultCatalog(): GameCatalog {
  return new GameCatalog()
    .register({
      id: 'platformer',
      description: 'Playable side-view platformer archetype.',
      createScene: () => new PlatformerScene(),
    })
    .register({
      id: 'top-down',
      description: 'Playable four-direction top-down archetype.',
      createScene: () => new TopDownScene(),
    })
    .register({
      id: 'runner',
      description: 'Playable automatic runner archetype.',
      createScene: () => new RunnerScene(),
    })
    .register({
      id: 'sandbox',
      description: 'Minimal core movement sandbox.',
      createScene: () => new SandboxScene(),
    })
    .register({
      id: 'forest-platformer',
      description: 'Configuration-first forest platformer example.',
      spec: examples['forest-platformer'],
      createScene: () =>
        new PlatformerScene(examples['forest-platformer'].title),
    })
    .register({
      id: 'robot-top-down',
      description: 'Configuration-first robot top-down example.',
      spec: examples['robot-top-down'],
      createScene: () => new TopDownScene(examples['robot-top-down'].title),
    })
    .register({
      id: 'space-runner',
      description: 'Configuration-first space runner example.',
      spec: examples['space-runner'],
      createScene: () => new RunnerScene(examples['space-runner'].title),
    });
}
