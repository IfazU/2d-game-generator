import { describe, expect, it } from 'vitest';
import { SceneDebugRegistry } from '../../src/debug/SceneDebugRegistry';

describe('scene debug customization', () => {
  it('exposes game-specific state and named test actions', () => {
    const registry = new SceneDebugRegistry();
    let score = 2;
    registry.configure({
      getState: () => ({ gatesPassed: score }),
      actions: { passGate: () => ++score },
    });

    expect(registry.getState()).toEqual({ gatesPassed: 2 });
    expect(registry.getActions()).toEqual(['passGate']);
    expect(registry.runAction('passGate')).toBe(3);
    expect(registry.getState()).toEqual({ gatesPassed: 3 });
  });

  it('rejects unknown actions clearly', () => {
    const registry = new SceneDebugRegistry();
    expect(() => registry.runAction('missing')).toThrow('Unknown debug action');
  });
});
