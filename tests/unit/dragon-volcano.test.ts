import { describe, expect, it } from 'vitest';
import {
  DRAGON_X,
  gapCenterFor,
  hasPassedDragon,
  isOutsidePlayableArea,
  VOLCANO_WIDTH,
} from '../../src/game/dragon-volcano/DragonVolcanoRules';

describe('dragon volcano game rules', () => {
  it('cycles safe, varied volcanic gap positions', () => {
    const firstCycle = Array.from({ length: 7 }, (_, index) =>
      gapCenterFor(index),
    );
    expect(new Set(firstCycle).size).toBeGreaterThan(4);
    expect(Math.min(...firstCycle)).toBeGreaterThan(180);
    expect(Math.max(...firstCycle)).toBeLessThan(380);
    expect(gapCenterFor(7)).toBe(gapCenterFor(0));
  });

  it('awards a gate only once after its trailing edge passes the dragon', () => {
    expect(hasPassedDragon(DRAGON_X - VOLCANO_WIDTH / 2 + 1, false)).toBe(
      false,
    );
    expect(hasPassedDragon(DRAGON_X - VOLCANO_WIDTH / 2 - 1, false)).toBe(true);
    expect(hasPassedDragon(DRAGON_X - VOLCANO_WIDTH, true)).toBe(false);
  });

  it('loses above the ceiling or below the lava while allowing the gap', () => {
    expect(isOutsidePlayableArea(79, 12)).toBe(true);
    expect(isOutsidePlayableArea(523, 12)).toBe(true);
    expect(isOutsidePlayableArea(280, 18)).toBe(false);
  });
});
