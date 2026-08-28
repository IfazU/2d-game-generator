export type ArchetypeId = 'platformer' | 'top-down' | 'runner';
export type GameSpec = {
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
};
export const gameSpec: GameSpec = {
  archetype: 'runner',
  title: 'Emberwing: Volcano Flight',
  theme: 'volcanic caldera',
  player: { name: 'Emberwing', asset: 'dragon.player' },
  objective: {
    description: 'Flap through volcanic gaps and survive for a high score',
    type: 'endless-score',
  },
  enemies: ['volcano-column'],
  requestedMechanics: ['hazards'],
  difficulty: 'normal',
  visualStyle: 'bold code-generated volcanic silhouettes and glowing lava',
};
