import type { GameSpec } from './GameSpec';
export const examples: Record<string, GameSpec> = {
  'forest-platformer': { archetype: 'platformer', title: 'Forest Star Rescue', theme: 'forest', player: { name: 'Ranger' }, objective: { description: 'Collect five forest stars' }, enemies: ['patrol-beetle'], collectible: 'forest-star', requestedMechanics: ['collectibles', 'hazards', 'patrol-enemy'], difficulty: 'normal' },
  'robot-top-down': { archetype: 'top-down', title: 'Robot Crystal Sweep', theme: 'robot-lab', player: { name: 'Utility Bot' }, objective: { description: 'Recover six power crystals' }, enemies: ['security-drone'], collectible: 'power-crystal', requestedMechanics: ['collectibles', 'health', 'chase-enemy', 'projectile-shooting'], difficulty: 'normal' },
  'space-runner': { archetype: 'runner', title: 'Comet Lane', theme: 'space', player: { name: 'Courier' }, objective: { description: 'Reach the jump gate' }, enemies: ['asteroid'], collectible: 'star-token', requestedMechanics: ['hazards', 'collectibles', 'timer'], difficulty: 'hard' },
};
