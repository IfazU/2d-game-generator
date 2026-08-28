import Phaser from 'phaser';

export type TextureDrawContext = {
  graphics: Phaser.GameObjects.Graphics;
  width: number;
  height: number;
};

export type ProceduralTextureOptions = {
  key: string;
  width: number;
  height: number;
  draw(context: TextureDrawContext): void;
};

export function createProceduralTexture(
  scene: Phaser.Scene,
  options: ProceduralTextureOptions,
): string {
  if (scene.textures.exists(options.key)) return options.key;
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  options.draw({
    graphics,
    width: options.width,
    height: options.height,
  });
  graphics.generateTexture(options.key, options.width, options.height);
  graphics.destroy();
  return options.key;
}

export function createRoundedRectTexture(
  scene: Phaser.Scene,
  options: {
    key: string;
    width: number;
    height: number;
    color: number;
    radius?: number;
    alpha?: number;
    strokeColor?: number;
    strokeWidth?: number;
  },
): string {
  return createProceduralTexture(scene, {
    ...options,
    draw: ({ graphics, width, height }) => {
      graphics
        .fillStyle(options.color, options.alpha ?? 1)
        .fillRoundedRect(
          0,
          0,
          width,
          height,
          options.radius ?? Math.min(width, height) / 4,
        );
      if (options.strokeColor !== undefined && options.strokeWidth) {
        graphics
          .lineStyle(options.strokeWidth, options.strokeColor)
          .strokeRoundedRect(
            options.strokeWidth / 2,
            options.strokeWidth / 2,
            width - options.strokeWidth,
            height - options.strokeWidth,
            options.radius ?? Math.min(width, height) / 4,
          );
      }
    },
  });
}

export function createCircleTexture(
  scene: Phaser.Scene,
  options: { key: string; diameter: number; color: number; alpha?: number },
): string {
  return createProceduralTexture(scene, {
    key: options.key,
    width: options.diameter,
    height: options.diameter,
    draw: ({ graphics, width, height }) =>
      graphics
        .fillStyle(options.color, options.alpha ?? 1)
        .fillCircle(width / 2, height / 2, Math.min(width, height) / 2),
  });
}

export function createPolygonTexture(
  scene: Phaser.Scene,
  options: {
    key: string;
    width: number;
    height: number;
    color: number;
    points: Array<{ x: number; y: number }>;
    alpha?: number;
  },
): string {
  return createProceduralTexture(scene, {
    ...options,
    draw: ({ graphics }) =>
      graphics
        .fillStyle(options.color, options.alpha ?? 1)
        .fillPoints(options.points, true),
  });
}
