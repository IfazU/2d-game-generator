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
  archetype: 'platformer',
  title: 'New Agent Game',
  theme: 'placeholder',
  player: { name: 'Hero' },
  objective: { description: 'Complete the archetype objective' },
  requestedMechanics: ['collectibles', 'hazards'],
  difficulty: 'normal',
  visualStyle: 'clean placeholder shapes',
};
