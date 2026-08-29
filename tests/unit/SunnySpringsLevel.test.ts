import { describe, expect, it } from 'vitest';
import {
  collectiblePositions,
  enemyDefinitions,
  FINISH_X,
  hazardPositions,
  objectiveCopy,
  platforms,
  REQUIRED_COLLECTIBLES,
  WORLD_WIDTH,
} from '../../src/game/sunny-springs/level';

describe('Sunny Springs level', () => {
  it('contains the promised progression mechanics', () => {
    expect(REQUIRED_COLLECTIBLES).toBe(6);
    expect(platforms.length).toBeGreaterThanOrEqual(10);
    expect(enemyDefinitions.length).toBeGreaterThanOrEqual(1);
    expect(hazardPositions.length).toBeGreaterThanOrEqual(1);
    expect(FINISH_X).toBeLessThan(WORLD_WIDTH);
    expect(FINISH_X).toBeGreaterThan(collectiblePositions.at(-1)!.x);
  });

  it('communicates collectible progress and finish readiness', () => {
    expect(objectiveCopy(2)).toContain('2/6');
    expect(objectiveCopy(6)).toContain('Windmill');
  });
});
