/**
 * Login Voice Service
 * 
 * Plays a voice file in the background when the login/signup screen appears
 * (right after the intro video ends).
 * 
 * Place your audio file at: apps/abyssos-portal/public/audio/login-voice.wav
 * Supported formats: .wav, .mp3, .ogg
 */

class LoginVoiceService {
  private audio: HTMLAudioElement | null = null;
  private hasPlayed: boolean = false;
  private volume: number = 0.7; // 70% volume for voice

  /**
   * Initialize and play the login voice
   * This should be called when the login screen appears
   */
  async play() {
    if (typeof window === 'undefined' || this.hasPlayed) return;

    try {
      // Create audio element
      this.audio = new Audio('/audio/login-voice.wav');
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';

      // Set up error handler before attempting to play
      this.audio.addEventListener('error', (e) => {
        console.warn('Login voice file not found or failed to load. Place your audio file at: public/audio/login-voice.wav');
        this.audio = null;
      });

      // Set up ended handler
      this.audio.addEventListener('ended', () => {
        if (this.audio) {
          this.audio = null;
        }
      });

      // Set up loadeddata handler to ensure file is ready
      this.audio.addEventListener('loadeddata', () => {
        // File is loaded, try to play
        this.audio?.play().then(() => {
          this.hasPlayed = true;
        }).catch((error) => {
          console.warn('Failed to play login voice (autoplay may be blocked):', error);
          // Don't mark as played if autoplay fails, so user can try again
        });
      });

      // Load the audio file
      this.audio.load();

      // Also try immediate play (in case loadeddata already fired)
      try {
        await this.audio.play();
        this.hasPlayed = true;
      } catch (error) {
        // Autoplay might be blocked, that's okay - loadeddata handler will try again
        console.warn('Immediate play failed (may be blocked by browser):', error);
      }
    } catch (error) {
      console.warn('Failed to initialize login voice:', error);
      this.audio = null;
    }
  }

  /**
   * Stop the voice (if still playing)
   */
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  /**
   * Reset so it can play again (useful for testing)
   */
  reset() {
    this.hasPlayed = false;
    this.stop();
  }
}

// Singleton instance
export const loginVoiceService = new LoginVoiceService();

