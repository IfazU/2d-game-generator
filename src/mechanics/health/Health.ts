export class Health {
  private value: number;
  private invulnerableUntil = 0;
  constructor(
    readonly maximum: number,
    private readonly invulnerabilityMs = 0,
  ) {
    this.value = maximum;
  }
  damage(amount: number, now = Date.now()): boolean {
    if (now < this.invulnerableUntil || this.value === 0) return false;
    this.value = Math.max(0, this.value - amount);
    this.invulnerableUntil = now + this.invulnerabilityMs;
    return true;
  }
  heal(amount: number): void {
    this.value = Math.min(this.maximum, this.value + amount);
  }
  get current(): number {
    return this.value;
  }
  get dead(): boolean {
    return this.value === 0;
  }
}
