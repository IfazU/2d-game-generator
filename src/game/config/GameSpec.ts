export type ArchetypeId = 'platformer' | 'top-down' | 'runner';
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
