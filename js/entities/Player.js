/**
 * Player - Represents the Mario character
 * Single Responsibility: Player movement, state, and physics
 */
export class Player {
    constructor(element, container, config) {
        this.element = element;
        this.container = container;
        this.config = config;

        // Position and movement
        this.position = config.PLAYER.INITIAL_POSITION;

        // Physics
        this.isJumping = false;
        this.velocityY = 0;

        // State
        this.direction = 'right';
        this.isWalking = false;
    }

    /**
     * Initialize player position
     */
    initialize() {
        this.element.style.left = `${this.position}px`;
        this.updateDirection('right');
    }

    /**
     * Move player to the left
     */
    moveLeft() {
        const containerRect = this.container.getBoundingClientRect();
        const playerRect = this.element.getBoundingClientRect();
        const minPosition = 0;

        this.position = Math.max(minPosition, this.position - this.config.PLAYER.MOVE_SPEED);
        this.updateDirection('left');
        this.setWalking(true);
        this.updatePosition();

        if (playerRect.left < containerRect.left) {
            this.position = 0;
            this.updatePosition();
        }
    }

    /**
     * Move player to the right
     */
    moveRight() {
        const containerRect = this.container.getBoundingClientRect();
        const playerRect = this.element.getBoundingClientRect();
        const maxPosition = containerRect.width - playerRect.width;

        this.position = Math.min(maxPosition, this.position + this.config.PLAYER.MOVE_SPEED);
        this.updateDirection('right');
        this.setWalking(true);
        this.updatePosition();

        if (playerRect.right > containerRect.right) {
            this.position = maxPosition;
            this.updatePosition();
        }
    }

    /**
     * Make player jump
     */
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = this.config.PHYSICS.JUMP_FORCE;

            this.element.classList.add('jumping');
            setTimeout(() => {
                this.element.classList.remove('jumping');
            }, this.config.ANIMATION.JUMP_DURATION);
        }
    }

    /**
     * Update jump physics
     */
    updateJump() {
        if (this.isJumping) {
            this.velocityY += this.config.PHYSICS.GRAVITY;
            let currentBottom = parseInt(this.element.style.bottom || this.config.PHYSICS.GROUND_LEVEL);
            currentBottom = parseFloat(currentBottom) - this.velocityY;

            if (currentBottom <= this.config.PHYSICS.GROUND_LEVEL) {
                currentBottom = this.config.PHYSICS.GROUND_LEVEL;
                this.isJumping = false;
                this.velocityY = 0;
            }

            this.element.style.bottom = `${currentBottom}%`;
        }
    }

    /**
     * Stop walking animation
     */
    stopWalking() {
        this.setWalking(false);
    }

    /**
     * Set walking state
     */
    setWalking(walking) {
        this.isWalking = walking;
        if (walking) {
            this.element.classList.add('walking');
        } else {
            this.element.classList.remove('walking');
        }
    }

    /**
     * Update player direction
     */
    updateDirection(direction) {
        if (this.direction !== direction) {
            this.direction = direction;
            this.element.classList.remove('facing-left', 'facing-right');
            this.element.classList.add(`facing-${direction}`);
        }
    }

    /**
     * Update player position on screen
     */
    updatePosition() {
        this.element.style.left = `${this.position}px`;
    }

    /**
     * Get player bounding rectangle
     */
    getBoundingRect() {
        return this.element.getBoundingClientRect();
    }

    /**
     * Get current position
     */
    getPosition() {
        return this.position;
    }

    /**
     * Check if player is jumping
     */
    getIsJumping() {
        return this.isJumping;
    }
}
