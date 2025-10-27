/**
 * Main entry point for the application
 * Initializes the game when DOM is fully loaded
 */
import { Game } from './Game.js';

/**
 * Initialize game on window load
 */
window.addEventListener('load', () => {
    try {
        const game = new Game();
        game.initialize();

        // Expose game instance for debugging (optional, remove in production)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.game = game;
        }
    } catch (error) {
        console.error('Failed to start game:', error);
        // Could show user-friendly error message here
    }
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
