import type { Health } from '../health/Health';
export function applyDamage(
  target: Health,
  amount: number,
  now?: number,
  onDeath?: () => void,
): boolean {
  const hit = target.damage(amount, now);
  if (hit && target.dead) onDeath?.();
  return hit;
}
