import { describe, expect, it, vi } from 'vitest';
import { Health } from '../../src/mechanics/health/Health';
import { applyDamage } from '../../src/mechanics/damage/applyDamage';
import { GameTimer } from '../../src/mechanics/timer/GameTimer';
import { PowerupManager } from '../../src/mechanics/powerups/PowerupManager';
describe('reusable mechanics', () => {
  it('applies damage and respects invulnerability', () => {
    const health = new Health(3, 100);
    expect(applyDamage(health, 1, 0)).toBe(true);
    expect(applyDamage(health, 1, 50)).toBe(false);
    expect(health.current).toBe(2);
  });
  it('expires a countdown once', () => {
    const expired = vi.fn();
    const timer = new GameTimer(1000, expired);
    timer.update(700);
    timer.update(400);
    timer.update(100);
    expect(timer.isExpired).toBe(true);
    expect(expired).toHaveBeenCalledOnce();
  });
  it('expires temporary powerups', () => {
    const powers = new PowerupManager();
    powers.activate('speed', 2, 100, 10);
    expect(powers.multiplier('speed', 50)).toBe(2);
    expect(powers.multiplier('speed', 111)).toBe(1);
  });
});
