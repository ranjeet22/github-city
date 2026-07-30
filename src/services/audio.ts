class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  private constructor() {
    // Read local storage settings for mute preference
    try {
      const storedMute = localStorage.getItem('github-city-muted');
      this.isMuted = storedMute === 'true';
    } catch (e) {
      this.isMuted = false;
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Initializes the audio element with a source URL.
   * Can be safely called multiple times; it will only initialize once.
   */
  public init(src: string) {
    if (this.audio) return;
    
    this.audio = new Audio(src);
    this.audio.loop = true;
    this.audio.volume = 0.22; // Low, non-distracting ambient volume
    this.audio.muted = this.isMuted;
  }

  /**
   * Plays the background audio. Gracefully catches autoplay blocks.
   */
  public play() {
    if (!this.audio) return;
    
    this.isPlaying = true;
    this.audio.play().catch((err) => {
      console.warn('Playback prevented by browser autoplay policy. Waiting for user gesture.', err);
    });
  }

  /**
   * Pauses the background audio.
   */
  public pause() {
    if (!this.audio) return;
    this.isPlaying = false;
    this.audio.pause();
  }

  /**
   * Sets the mute state on the audio element and persists it.
   */
  public setMute(mute: boolean) {
    this.isMuted = mute;
    try {
      localStorage.setItem('github-city-muted', mute ? 'true' : 'false');
    } catch (e) {
      // Ignore storage errors in sandbox environments
    }
    
    if (this.audio) {
      this.audio.muted = mute;
    }
  }

  /**
   * Returns current mute preference.
   */
  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Returns whether the music is playing.
   */
  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioManager = AudioManager.getInstance();
