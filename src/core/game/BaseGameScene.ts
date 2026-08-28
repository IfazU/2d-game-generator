import Phaser from 'phaser';
import { createPlaceholderAssets } from '../assets/PlaceholderAssets';
import {
  createGameControls,
  type GameControls,
  type InputBindings,
} from '../input/GameInput';
import { GameHud, type HudOptions } from '../ui/GameHud';
import { GameSession } from './GameSession';
import { installGameDebug } from '../../debug/GameDebug';
import {
  SceneDebugRegistry,
  type SceneDebugOptions,
} from '../../debug/SceneDebugRegistry';
export abstract class BaseGameScene extends Phaser.Scene {
  session!: GameSession;
  controls!: GameControls;
  hud!: GameHud;
  protected objective = '';
  protected player?: Phaser.Physics.Arcade.Sprite;
  private readonly debugRegistry = new SceneDebugRegistry();
  protected initialize(setup: BaseSceneSetup): void;
  protected initialize(
    title: string,
    controls: string,
    objective: string,
    health?: number,
  ): void;
  protected initialize(
    setupOrTitle: BaseSceneSetup | string,
    controls?: string,
    objective?: string,
    health = 3,
  ): void {
    const setup: BaseSceneSetup =
      typeof setupOrTitle === 'string'
        ? {
            title: setupOrTitle,
            controls: controls ?? '',
            objective: objective ?? '',
            health,
          }
        : setupOrTitle;
    createPlaceholderAssets(this);
    this.session = new GameSession(setup.health ?? 3);
    this.session.load();
    this.controls = createGameControls(this, setup.input);
    this.objective = setup.objective;
    this.hud = new GameHud(this, setup.title, setup.controls, setup.hud);
    this.session.start();
    installGameDebug(this);
  }
  getPlayerPosition(): { x: number; y: number } | null {
    return this.player ? { x: this.player.x, y: this.player.y } : null;
  }
  configureDebug(options: SceneDebugOptions): void {
    this.debugRegistry.configure(options);
  }
  getDebugState(): Record<string, unknown> {
    return this.debugRegistry.getState();
  }
  getDebugActions(): string[] {
    return this.debugRegistry.getActions();
  }
  runDebugAction(name: string): unknown {
    return this.debugRegistry.runAction(name);
  }
  win(): void {
    this.session.win();
  }
  lose(): void {
    this.session.lose();
  }
  restart(): void {
    this.session.restart();
    this.scene.restart();
  }
  protected commonUpdate(delta: number): boolean {
    this.session.tick(delta);
    const snapshot = this.session.snapshot();
    this.hud.update(snapshot, this.objective);
    if (Phaser.Input.Keyboard.JustDown(this.controls.restart)) this.restart();
    if (
      (snapshot.phase === 'won' || snapshot.phase === 'lost') &&
      this.input.activePointer.leftButtonDown()
    )
      this.restart();
    return snapshot.phase === 'playing';
  }
}

export type BaseSceneSetup = {
  title: string;
  controls: string;
  objective: string;
  health?: number;
  hud?: HudOptions;
  input?: InputBindings;
};
