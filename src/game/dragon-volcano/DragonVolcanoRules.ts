export const DRAGON_X = 230;
export const PLAYABLE_TOP = 80;
export const PLAYABLE_BOTTOM = 522;
export const VOLCANO_WIDTH = 112;
export const VOLCANO_GAP = 188;
export const VOLCANO_SPACING = 330;

const GAP_CENTERS = [282, 220, 330, 255, 350, 205, 305];

export function gapCenterFor(index: number): number {
  return GAP_CENTERS[index % GAP_CENTERS.length];
}

export function hasPassedDragon(
  obstacleX: number,
  alreadyScored: boolean,
): boolean {
  return !alreadyScored && obstacleX + VOLCANO_WIDTH / 2 < DRAGON_X;
}

export function isOutsidePlayableArea(y: number, halfHeight: number): boolean {
  return y - halfHeight <= PLAYABLE_TOP || y + halfHeight >= PLAYABLE_BOTTOM;
}
