import type { InputBindings } from '../core/input/GameInput';
import type { HudOptions } from '../core/ui/GameHud';

export type CommonArchetypeOptions = {
  title?: string;
  controlsText?: string;
  objective?: string;
  backgroundColor?: string;
  health?: number;
  hud?: HudOptions;
  input?: InputBindings;
};

export function normalizeArchetypeOptions<T extends CommonArchetypeOptions>(
  value: string | T | undefined,
): T {
  return (typeof value === 'string' ? { title: value } : (value ?? {})) as T;
}
