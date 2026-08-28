export type GamePhase = 'boot' | 'load' | 'start' | 'playing' | 'won' | 'lost';
export type SessionSnapshot = {
  phase: GamePhase;
  score: number;
  health: number;
  elapsedMs: number;
};

export class GameSession {
  private phase: GamePhase = 'boot';
  private score = 0;
  private health: number;
  private elapsedMs = 0;
  constructor(private readonly startingHealth = 3) {
    this.health = startingHealth;
  }
  load(): void {
    this.phase = 'load';
  }
  start(): void {
    this.phase = 'playing';
  }
  tick(deltaMs: number): void {
    if (this.phase === 'playing') this.elapsedMs += deltaMs;
  }
  addScore(amount: number): void {
    if (this.phase === 'playing') this.score += amount;
  }
  damage(amount: number): void {
    if (this.phase === 'playing') {
      this.health = Math.max(0, this.health - amount);
      if (this.health === 0) this.lose();
    }
  }
  heal(amount: number): void {
    this.health = Math.min(this.startingHealth, this.health + amount);
  }
  win(): void {
    if (this.phase === 'playing') this.phase = 'won';
  }
  lose(): void {
    if (this.phase === 'playing') this.phase = 'lost';
  }
  restart(): void {
    this.phase = 'start';
    this.score = 0;
    this.health = this.startingHealth;
    this.elapsedMs = 0;
  }
  snapshot(): SessionSnapshot {
    return {
      phase: this.phase,
      score: this.score,
      health: this.health,
      elapsedMs: this.elapsedMs,
    };
  }
}
