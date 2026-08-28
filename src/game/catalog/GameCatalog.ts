import type Phaser from 'phaser';
import type { GameSpec } from '../config/GameSpec';

export type GameEntry = {
  id: string;
  description: string;
  spec?: GameSpec;
  createScene(): Phaser.Scene;
};

export class GameCatalog {
  private readonly entries = new Map<string, GameEntry>();

  register(entry: GameEntry): this {
    if (this.entries.has(entry.id)) {
      throw new Error(`Game entry "${entry.id}" is already registered.`);
    }
    this.entries.set(entry.id, entry);
    return this;
  }

  get(id: string): GameEntry | undefined {
    return this.entries.get(id);
  }

  require(id: string): GameEntry {
    const entry = this.get(id);
    if (!entry) {
      throw new Error(
        `Unknown game "${id}". Available games: ${this.ids().join(', ')}.`,
      );
    }
    return entry;
  }

  ids(): string[] {
    return [...this.entries.keys()];
  }
}

export function selectGameId(search: string, defaultId: string): string {
  const params = new URLSearchParams(search);
  return (
    params.get('game') ??
    params.get('example') ??
    params.get('archetype') ??
    defaultId
  );
}
