/**
 * Main entry point for the application
 * Initializes the game when DOM is fully loaded
 */
import { Game } from './Game.js';
import { ResourceLoader } from './utils/ResourceLoader.js';

/**
 * List of resources to preload
 */
const RESOURCES = {
    images: [
        './img/logo.png',
        './img/mario.png',
        './img/mario-jumping.png',
        './img/mario-won.png'
    ],
    audio: [
        './music/mario-ground-theme.mp3',
        './music/mario-castle-complete.mp3'
    ]
};

/**
 * Initialize game with loading screen
 */
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');
    const gameHeader = document.querySelector('.game-header');
    const gameContainer = document.getElementById('game-container');

    // Create resource loader
    const loader = new ResourceLoader();

    // Add all resources to loader
    RESOURCES.images.forEach(src => loader.addImage(src));
    RESOURCES.audio.forEach(src => loader.addAudio(src));

    // Setup progress callback
    loader.onProgress((progress, loaded, total) => {
        loadingBar.style.width = `${progress}%`;
        loadingText.textContent = `Loading... ${progress}%`;
        console.log(`Loading: ${loaded}/${total} (${progress}%)`);
    });

    // Setup complete callback
    loader.onComplete(() => {
        console.log('All resources loaded!');

        // Small delay before hiding loading screen
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');

            // Wait for fade out animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                gameHeader.style.display = 'block';
                gameContainer.style.display = 'block';

                // Initialize game
                try {
                    const game = new Game();
                    game.initialize();

                    // Expose game instance for debugging
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        window.game = game;
                    }
                } catch (error) {
                    console.error('Failed to start game:', error);
                }
            }, 500); // Match CSS fade-out duration
        }, 500); // Small delay to show 100%
    });

    // Start loading
    loader.load().catch(error => {
        console.error('Error during resource loading:', error);
        // Still show the game even if some resources fail
        loader.onCompleteCallback();
    });
});

/**
 * Handle errors gracefully
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Could implement error reporting service here
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
