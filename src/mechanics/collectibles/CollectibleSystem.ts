import Phaser from 'phaser';
export type CollectibleOptions = {
  scene: Phaser.Scene;
  player: Phaser.Physics.Arcade.Sprite;
  items: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup;
  required?: number;
  value?: number;
  onCollect?: (count: number) => void;
  onComplete?: () => void;
};
export class CollectibleSystem {
  private count = 0;
  constructor(options: CollectibleOptions) {
    options.scene.physics.add.overlap(
      options.player,
      options.items,
      (_player, item) => {
        const sprite = item as Phaser.Physics.Arcade.Sprite;
        if (!sprite.active) return;
        sprite.disableBody(true, true);
        this.count += 1;
        options.onCollect?.(this.count);
        if (this.count >= (options.required ?? options.items.getLength()))
          options.onComplete?.();
      },
    );
  }
  get collected(): number {
    return this.count;
  }
}
