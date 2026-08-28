export type SceneDebugOptions = {
  getState?: () => Record<string, unknown>;
  actions?: Record<string, () => unknown>;
};

export class SceneDebugRegistry {
  private stateProvider?: () => Record<string, unknown>;
  private readonly actions = new Map<string, () => unknown>();

  configure(options: SceneDebugOptions): void {
    this.stateProvider = options.getState;
    this.actions.clear();
    for (const [name, action] of Object.entries(options.actions ?? {})) {
      this.actions.set(name, action);
    }
  }

  getState(): Record<string, unknown> {
    return this.stateProvider?.() ?? {};
  }

  getActions(): string[] {
    return [...this.actions.keys()];
  }

  runAction(name: string): unknown {
    const action = this.actions.get(name);
    if (!action) throw new Error(`Unknown debug action "${name}".`);
    return action();
  }
}
