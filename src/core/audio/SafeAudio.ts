import Phaser from 'phaser';
export class SafeAudio {
  private muted = false;
  constructor(private readonly scene: Phaser.Scene) {}
  play(key: string, config?: Phaser.Types.Sound.SoundConfig): void {
    if (!this.muted && this.scene.cache.audio.exists(key))
      this.scene.sound.play(key, config);
  }
  music(key: string, volume = 0.35): void {
    this.play(key, { loop: true, volume });
  }
  setMuted(muted: boolean): void {
    this.muted = muted;
    this.scene.sound.mute = muted;
  }
  setVolume(volume: number): void {
    this.scene.sound.volume = Phaser.Math.Clamp(volume, 0, 1);
  }
}
