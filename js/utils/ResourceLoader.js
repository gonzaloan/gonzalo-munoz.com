/**
 * ResourceLoader - Handles preloading of all game resources
 * Single Responsibility: Asset loading and progress tracking
 */
export class ResourceLoader {
    constructor() {
        this.resources = {
            images: [],
            audio: []
        };
        this.loaded = 0;
        this.total = 0;
        this.onProgressCallback = null;
        this.onCompleteCallback = null;
    }

    /**
     * Add image to load queue
     */
    addImage(src) {
        this.resources.images.push(src);
        this.total++;
    }

    /**
     * Add audio to load queue
     */
    addAudio(src) {
        this.resources.audio.push(src);
        this.total++;
    }

    /**
     * Set progress callback
     */
    onProgress(callback) {
        this.onProgressCallback = callback;
    }

    /**
     * Set complete callback
     */
    onComplete(callback) {
        this.onCompleteCallback = callback;
    }

    /**
     * Start loading all resources
     */
    async load() {
        const promises = [];

        // Load images
        this.resources.images.forEach(src => {
            promises.push(this.loadImage(src));
        });

        // Load audio
        this.resources.audio.forEach(src => {
            promises.push(this.loadAudio(src));
        });

        try {
            await Promise.all(promises);
            if (this.onCompleteCallback) {
                this.onCompleteCallback();
            }
        } catch (error) {
            console.error('Error loading resources:', error);
        }
    }

    /**
     * Load a single image
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.incrementProgress();
                resolve(img);
            };

            img.onerror = () => {
                console.warn(`Failed to load image: ${src}`);
                this.incrementProgress(); // Still increment to not block loading
                resolve(null);
            };

            img.src = src;
        });
    }

    /**
     * Load a single audio file
     */
    loadAudio(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();

            audio.addEventListener('canplaythrough', () => {
                this.incrementProgress();
                resolve(audio);
            }, { once: true });

            audio.addEventListener('error', () => {
                console.warn(`Failed to load audio: ${src}`);
                this.incrementProgress(); // Still increment to not block loading
                resolve(null);
            }, { once: true });

            audio.src = src;
            audio.load();
        });
    }

    /**
     * Increment progress and notify
     */
    incrementProgress() {
        this.loaded++;
        const progress = Math.floor((this.loaded / this.total) * 100);

        if (this.onProgressCallback) {
            this.onProgressCallback(progress, this.loaded, this.total);
        }
    }

    /**
     * Get current progress percentage
     */
    getProgress() {
        return this.total > 0 ? Math.floor((this.loaded / this.total) * 100) : 0;
    }

    /**
     * Check if loading is complete
     */
    isComplete() {
        return this.loaded === this.total;
    }
}
