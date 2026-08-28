import Phaser from 'phaser';
import { createPlaceholderAssets } from '../assets/PlaceholderAssets';
import { createGameControls, type GameControls } from '../input/GameInput';
import { GameHud } from '../ui/GameHud';
import { GameSession } from './GameSession';
import { installGameDebug } from '../../debug/GameDebug';
export abstract class BaseGameScene extends Phaser.Scene {
  session!: GameSession; controls!: GameControls; hud!: GameHud; protected objective = ''; protected player?: Phaser.Physics.Arcade.Sprite;
  protected initialize(title: string, controls: string, objective: string, health = 3): void { createPlaceholderAssets(this); this.session = new GameSession(health); this.session.load(); this.controls = createGameControls(this); this.objective = objective; this.hud = new GameHud(this, title, controls); this.session.start(); installGameDebug(this); }
  getPlayerPosition(): { x: number; y: number } | null { return this.player ? { x: this.player.x, y: this.player.y } : null; }
  win(): void { this.session.win(); } lose(): void { this.session.lose(); } restart(): void { this.session.restart(); this.scene.restart(); }
  protected commonUpdate(delta: number): boolean { this.session.tick(delta); const snapshot = this.session.snapshot(); this.hud.update(snapshot, this.objective); if (Phaser.Input.Keyboard.JustDown(this.controls.restart)) this.restart(); if ((snapshot.phase === 'won' || snapshot.phase === 'lost') && this.input.activePointer.leftButtonDown()) this.restart(); return snapshot.phase === 'playing'; }
}
