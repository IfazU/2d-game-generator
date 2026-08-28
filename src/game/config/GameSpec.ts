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
  id: 'platformer',
  archetype: 'platformer',
  title: 'New Agent Game',
  theme: 'placeholder',
  player: { name: 'Hero' },
  objective: { description: 'Complete the archetype objective' },
  requestedMechanics: ['collectibles', 'hazards'],
  difficulty: 'normal',
  visualStyle: 'clean placeholder shapes',
};
