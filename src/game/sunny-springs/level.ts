export const WORLD_WIDTH = 3600;
export const WORLD_HEIGHT = 540;
export const GROUND_Y = 512;

export const platforms = [
  { x: 320, y: GROUND_Y, width: 640 },
  { x: 860, y: GROUND_Y, width: 360 },
  { x: 1280, y: GROUND_Y, width: 360 },
  { x: 1760, y: GROUND_Y, width: 480 },
  { x: 2240, y: GROUND_Y, width: 360 },
  { x: 2730, y: GROUND_Y, width: 500 },
  { x: 3290, y: GROUND_Y, width: 620 },
  { x: 520, y: 410, width: 180 },
  { x: 810, y: 345, width: 170 },
  { x: 1110, y: 395, width: 160 },
  { x: 1490, y: 330, width: 200 },
  { x: 1910, y: 385, width: 180 },
  { x: 2350, y: 320, width: 210 },
  { x: 2830, y: 390, width: 200 },
] as const;

export const collectiblePositions = [
  { x: 510, y: 355 },
  { x: 810, y: 290 },
  { x: 1110, y: 340 },
  { x: 1490, y: 275 },
  { x: 2350, y: 265 },
  { x: 2830, y: 335 },
] as const;

export const hazardPositions = [
  { x: 680, y: 478 },
  { x: 2090, y: 478 },
  { x: 3000, y: 478 },
] as const;

export const enemyDefinitions = [
  { x: 980, y: 460, min: 900, max: 1170 },
  { x: 2500, y: 460, min: 2420, max: 2630 },
] as const;

export const FINISH_X = 3435;
export const REQUIRED_COLLECTIBLES = collectiblePositions.length;

export function objectiveCopy(collected: number): string {
  const remaining = Math.max(0, REQUIRED_COLLECTIBLES - collected);
  return remaining === 0
    ? 'All drops found · Windmill →'
    : `Drops ${collected}/${REQUIRED_COLLECTIBLES} · Windmill →`;
}
