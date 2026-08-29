import type { InputBindings } from '../../core/input/GameInput';
import type { HudOptions } from '../../core/ui/GameHud';

export type ArchetypeId = 'platformer' | 'top-down' | 'runner';
export type GameplayTuning = {
  moveSpeed?: number;
  jumpSpeed?: number;
  enemySpeed?: number;
  chaseRange?: number;
  projectileSpeed?: number;
  projectileCooldown?: number;
  hitInvulnerabilityMs?: number;
  scorePerCollectible?: number;
  baseSpeed?: number;
  maxSpeedBonus?: number;
  accelerationDistance?: number;
  fastFallSpeed?: number;
  finishX?: number;
  health?: number;
};

export type GamePresentation = {
  backgroundColor?: string;
  controlsText?: string;
  hud?: HudOptions;
};

export type GameSpec = {
  id: string;
  archetype: ArchetypeId;
  title: string;
  theme?: string;
  player?: { name?: string; asset?: string };
  objective?: { description: string; type?: string };
  enemies?: string[];
  collectible?: string;
  requestedMechanics?: string[];
  difficulty?: 'easy' | 'normal' | 'hard';
  visualStyle?: string;
  gameplay?: GameplayTuning;
  presentation?: GamePresentation;
  input?: InputBindings;
};
export const gameSpec: GameSpec = {
  id: 'sunny-springs',
  archetype: 'platformer',
  title: 'Sunny Springs Adventure',
  theme: 'bright hillside clockwork garden',
  player: { name: 'Pip' },
  objective: {
    description: 'Gather 6 sun drops, then reach the windmill',
    type: 'finish',
  },
  enemies: ['clockwork-crawler'],
  collectible: 'sun-drop',
  requestedMechanics: [
    'collectibles',
    'health',
    'damage',
    'hazards',
    'patrol-enemy',
  ],
  difficulty: 'normal',
  visualStyle: 'original code-drawn storybook shapes with warm spring colours',
  gameplay: {
    moveSpeed: 255,
    jumpSpeed: 480,
    enemySpeed: 72,
    scorePerCollectible: 100,
    health: 3,
  },
  presentation: {
    backgroundColor: '#79d7f2',
    controlsText: '← → / A D move · Space / ↑ / W jump · R restart',
    hud: {
      scoreLabel: 'Sun score',
      healthLabel: 'Hearts',
      winText: 'The windmill is shining!',
      loseText: 'Pip needs another try',
      restartText: 'Press R or click to restart',
      panelColor: 0x173653,
      panelAlpha: 0.9,
      accentColor: '#fff2a8',
    },
  },
  input: {
    secondary: 65,
    primary: 68,
    up: 87,
  },
};
