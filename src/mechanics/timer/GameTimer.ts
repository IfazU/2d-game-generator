export class GameTimer {
  private elapsed = 0;
  private expired = false;
  constructor(
    readonly durationMs?: number,
    private readonly onExpire?: () => void,
  ) {}
  update(deltaMs: number): void {
    if (this.expired) return;
    this.elapsed += deltaMs;
    if (this.durationMs !== undefined && this.elapsed >= this.durationMs) {
      this.expired = true;
      this.onExpire?.();
    }
  }
  get valueMs(): number {
    return this.durationMs === undefined
      ? this.elapsed
      : Math.max(0, this.durationMs - this.elapsed);
  }
  get isExpired(): boolean {
    return this.expired;
  }
  reset(): void {
    this.elapsed = 0;
    this.expired = false;
  }
}
