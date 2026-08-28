import type { BaseGameScene } from '../core/game/BaseGameScene';
import type { SessionSnapshot } from '../core/game/GameSession';

export type GameDebugApi = {
  getState(): SessionSnapshot;
  getPlayerPosition(): { x: number; y: number } | null;
  getScore(): number;
  getHealth(): number;
  isWon(): boolean;
  isLost(): boolean;
  getActiveScene(): string;
  getEntityCount(): number;
  getClockMs(): number;
  getCustomState(): Record<string, unknown>;
  getActions(): string[];
  runAction(name: string): unknown;
  restart(): void;
};

declare global {
  interface Window {
    __GAME_DEBUG__?: GameDebugApi;
  }
}

export function installGameDebug(scene: BaseGameScene): void {
  if (!import.meta.env.DEV && import.meta.env.MODE !== 'test') return;
  window.__GAME_DEBUG__ = {
    getState: () => scene.session.snapshot(),
    getPlayerPosition: () => scene.getPlayerPosition(),
    getScore: () => scene.session.snapshot().score,
    getHealth: () => scene.session.snapshot().health,
    isWon: () => scene.session.snapshot().phase === 'won',
    isLost: () => scene.session.snapshot().phase === 'lost',
    getActiveScene: () => scene.scene.key,
    getEntityCount: () => scene.children.length,
    getClockMs: () => scene.time.now,
    getCustomState: () => scene.getDebugState(),
    getActions: () => scene.getDebugActions(),
    runAction: (name) => scene.runDebugAction(name),
    restart: () => scene.restart(),
  };
}
