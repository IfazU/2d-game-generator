import { describe, expect, it } from 'vitest';
import { GameSession } from '../../src/core/game/GameSession';
describe('GameSession', () => {
  it('handles score, loss, and restart consistently', () => {
    const session = new GameSession(2);
    session.start();
    session.addScore(5);
    session.damage(2);
    expect(session.snapshot()).toMatchObject({
      phase: 'lost',
      score: 5,
      health: 0,
    });
    session.restart();
    expect(session.snapshot()).toMatchObject({
      phase: 'start',
      score: 0,
      health: 2,
    });
  });
});
