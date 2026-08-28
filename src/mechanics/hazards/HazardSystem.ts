import Phaser from 'phaser';
export function connectHazards(scene: Phaser.Scene, target: Phaser.Types.Physics.Arcade.GameObjectWithBody, hazards: Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup, onHit: () => void): Phaser.Physics.Arcade.Collider { return scene.physics.add.overlap(target, hazards, onHit); }
