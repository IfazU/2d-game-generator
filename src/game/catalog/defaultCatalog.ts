import { PlatformerScene } from '../../archetypes/platformer/PlatformerScene';
import { RunnerScene } from '../../archetypes/runner/RunnerScene';
import { SandboxScene } from '../../archetypes/sandbox/SandboxScene';
import { TopDownScene } from '../../archetypes/top-down/TopDownScene';
import { examples } from '../config/examples';
import type { GameSpec } from '../config/GameSpec';
import { gameSpec } from '../config/GameSpec';
import { SunnySpringsScene } from '../sunny-springs/SunnySpringsScene';
import { GameCatalog } from './GameCatalog';

export function createDefaultCatalog(): GameCatalog {
  return new GameCatalog()
    .register({
      id: 'sunny-springs',
      description:
        'Original side-scrolling platform adventure through a clockwork garden.',
      spec: gameSpec,
      createScene: () => new SunnySpringsScene(gameSpec),
    })
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
        new PlatformerScene(platformerOptions(examples['forest-platformer'])),
    })
    .register({
      id: 'robot-top-down',
      description: 'Configuration-first robot top-down example.',
      spec: examples['robot-top-down'],
      createScene: () =>
        new TopDownScene(topDownOptions(examples['robot-top-down'])),
    })
    .register({
      id: 'space-runner',
      description: 'Configuration-first space runner example.',
      spec: examples['space-runner'],
      createScene: () =>
        new RunnerScene(runnerOptions(examples['space-runner'])),
    });
}

function commonOptions(spec: GameSpec) {
  return {
    title: spec.title,
    objective: spec.objective?.description,
    controlsText: spec.presentation?.controlsText,
    backgroundColor: spec.presentation?.backgroundColor,
    health: spec.gameplay?.health,
    hud: spec.presentation?.hud,
    input: spec.input,
  };
}

function platformerOptions(spec: GameSpec) {
  return {
    ...commonOptions(spec),
    moveSpeed: spec.gameplay?.moveSpeed,
    jumpSpeed: spec.gameplay?.jumpSpeed,
    enemySpeed: spec.gameplay?.enemySpeed,
    scorePerCollectible: spec.gameplay?.scorePerCollectible,
  };
}

function topDownOptions(spec: GameSpec) {
  return {
    ...commonOptions(spec),
    moveSpeed: spec.gameplay?.moveSpeed,
    enemySpeed: spec.gameplay?.enemySpeed,
    chaseRange: spec.gameplay?.chaseRange,
    projectileSpeed: spec.gameplay?.projectileSpeed,
    projectileCooldown: spec.gameplay?.projectileCooldown,
    hitInvulnerabilityMs: spec.gameplay?.hitInvulnerabilityMs,
  };
}

function runnerOptions(spec: GameSpec) {
  return {
    ...commonOptions(spec),
    baseSpeed: spec.gameplay?.baseSpeed,
    maxSpeedBonus: spec.gameplay?.maxSpeedBonus,
    accelerationDistance: spec.gameplay?.accelerationDistance,
    jumpSpeed: spec.gameplay?.jumpSpeed,
    fastFallSpeed: spec.gameplay?.fastFallSpeed,
    finishX: spec.gameplay?.finishX,
  };
}
