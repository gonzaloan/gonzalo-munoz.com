/**
 * InputManager - Handles all user input (keyboard, mouse, touch)
 * Single Responsibility: Input event handling and delegation
 */
export class InputManager {
    constructor(player, config) {
        this.player = player;
        this.config = config;
        this.leftInterval = null;
        this.rightInterval = null;
        this.onJumpCallback = null;
    }

    /**
     * Initialize all event listeners
     */
    initialize() {
        this.setupKeyboardControls();
        this.setupMobileControls();
    }

    /**
     * Setup keyboard event listeners
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    /**
     * Handle keydown events
     */
    handleKeyDown(event) {
        switch (event.code) {
            case 'ArrowRight':
            case 'KeyD':
                this.player.moveRight();
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.player.moveLeft();
                break;
            case 'Space':
            case 'ArrowUp':
                if (!this.player.getIsJumping()) {
                    this.player.jump();
                    if (this.onJumpCallback) {
                        this.onJumpCallback();
                    }
                }
                break;
        }
    }

    /**
     * Handle keyup events
     */
    handleKeyUp(event) {
        const movementKeys = ['ArrowRight', 'KeyD', 'ArrowLeft', 'KeyA'];
        if (movementKeys.includes(event.code)) {
            this.player.stopWalking();
        }
    }

    /**
     * Setup mobile control buttons
     */
    setupMobileControls() {
        const leftButton = document.getElementById('left-arrow');
        const rightButton = document.getElementById('right-arrow');

        if (!leftButton || !rightButton) {
            console.warn('Mobile control buttons not found');
            return;
        }

        this.setupButtonListeners(leftButton, 'left');
        this.setupButtonListeners(rightButton, 'right');
    }

    /**
     * Setup listeners for a single button
     */
    setupButtonListeners(button, direction) {
        // Touch events
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startContinuousMovement(direction);
        });

        button.addEventListener('touchend', () => {
            this.stopContinuousMovement(direction);
        });

        // Mouse events (for desktop testing)
        button.addEventListener('mousedown', () => {
            this.startContinuousMovement(direction);
        });

        button.addEventListener('mouseup', () => {
            this.stopContinuousMovement(direction);
        });

        button.addEventListener('mouseleave', () => {
            this.stopContinuousMovement(direction);
        });
    }

    /**
     * Start continuous movement in a direction
     */
    startContinuousMovement(direction) {
        const moveFunction = direction === 'left'
            ? () => this.player.moveLeft()
            : () => this.player.moveRight();

        const interval = setInterval(
            moveFunction,
            this.config.ANIMATION.MOBILE_CONTROL_INTERVAL
        );

        if (direction === 'left') {
            this.leftInterval = interval;
        } else {
            this.rightInterval = interval;
        }
    }

    /**
     * Stop continuous movement
     */
    stopContinuousMovement(direction) {
        const interval = direction === 'left' ? this.leftInterval : this.rightInterval;

        if (interval) {
            clearInterval(interval);
            if (direction === 'left') {
                this.leftInterval = null;
            } else {
                this.rightInterval = null;
            }
        }

        this.player.stopWalking();
    }

    /**
     * Set callback for jump event
     */
    setJumpCallback(callback) {
        this.onJumpCallback = callback;
    }

    /**
     * Cleanup intervals
     */
    cleanup() {
        if (this.leftInterval) {
            clearInterval(this.leftInterval);
        }
        if (this.rightInterval) {
            clearInterval(this.rightInterval);
        }
    }
}
