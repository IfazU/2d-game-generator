import { describe, expect, it } from 'vitest';
import { GameCatalog, selectGameId } from '../../src/game/catalog/GameCatalog';

describe('GameCatalog', () => {
  it('registers and resolves a scene factory', () => {
    const scene = { key: 'test' };
    const catalog = new GameCatalog().register({
      id: 'test',
      description: 'Test game',
      createScene: () => scene as never,
    });
    expect(catalog.require('test').createScene()).toBe(scene);
    expect(catalog.ids()).toEqual(['test']);
  });

  it('rejects duplicate ids with an actionable message', () => {
    const entry = {
      id: 'test',
      description: 'Test game',
      createScene: () => ({}) as never,
    };
    const catalog = new GameCatalog().register(entry);
    expect(() => catalog.register(entry)).toThrow('already registered');
  });

  it('selects game, example, archetype, then the default in priority order', () => {
    expect(selectGameId('?game=custom&archetype=runner', 'platformer')).toBe(
      'custom',
    );
    expect(selectGameId('?example=space-runner', 'platformer')).toBe(
      'space-runner',
    );
    expect(selectGameId('?archetype=runner', 'platformer')).toBe('runner');
    expect(selectGameId('', 'platformer')).toBe('platformer');
  });
});
