/**
 * AudioManager - Handles all audio operations
 * Single Responsibility: Audio playback and control
 */
export class AudioManager {
    constructor(config) {
        this.config = config;
        this.bgMusic = null;
        this.victoryMusic = null;
        this.isInitialized = false;
    }

    /**
     * Initialize audio elements
     */
    initialize() {
        this.bgMusic = document.getElementById('bg-music');
        this.victoryMusic = document.getElementById('victory-music');

        if (!this.bgMusic || !this.victoryMusic) {
            console.error('Audio elements not found');
            return;
        }

        this.setVolumes();
        this.attemptAutoPlay();
        this.isInitialized = true;
    }

    /**
     * Set volume levels for all audio elements
     */
    setVolumes() {
        if (this.bgMusic) {
            this.bgMusic.volume = this.config.AUDIO.BACKGROUND_VOLUME;
        }
        if (this.victoryMusic) {
            this.victoryMusic.volume = this.config.AUDIO.VICTORY_VOLUME;
        }
    }

    /**
     * Attempt to autoplay background music
     * Modern browsers require user interaction first
     */
    attemptAutoPlay() {
        const playPromise = this.bgMusic.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                this.setupUserInteractionTrigger();
            });
        }
    }

    /**
     * Setup listeners for user interaction to start music
     */
    setupUserInteractionTrigger() {
        const startMusic = () => {
            this.playBackgroundMusic();
            this.removeInteractionListeners(startMusic);
        };

        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);
        document.addEventListener('touchstart', startMusic);
    }

    /**
     * Remove interaction listeners after first trigger
     */
    removeInteractionListeners(handler) {
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
        document.removeEventListener('touchstart', handler);
    }

    /**
     * Play background music
     */
    playBackgroundMusic() {
        if (this.bgMusic && this.bgMusic.paused) {
            this.bgMusic.play().catch(error => {
                console.error('Error playing background music:', error);
            });
        }
    }

    /**
     * Stop background music and play victory music
     */
    playVictoryMusic() {
        this.stopBackgroundMusic();

        if (this.victoryMusic) {
            this.victoryMusic.play().catch(error => {
                console.error('Error playing victory music:', error);
            });
        }
    }

    /**
     * Stop and reset background music
     */
    stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    /**
     * Pause background music
     */
    pauseBackgroundMusic() {
        if (this.bgMusic && !this.bgMusic.paused) {
            this.bgMusic.pause();
        }
    }

    /**
     * Check if audio is initialized
     */
    isReady() {
        return this.isInitialized;
    }
}
