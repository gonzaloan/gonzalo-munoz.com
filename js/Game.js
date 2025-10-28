/**
 * Game - Main game orchestrator
 * Follows Clean Architecture principles
 * Coordinates all managers and entities
 */
import { GameConfig } from './config/GameConfig.js';
import { AudioManager } from './managers/AudioManager.js';
import { UIManager } from './managers/UIManager.js';
import { InputManager } from './managers/InputManager.js';
import { Player } from './entities/Player.js';
import { CollisionDetector } from './utils/CollisionDetector.js';
import { DOMBuilder } from './utils/DOMBuilder.js';

export class Game {
    constructor() {
        // DOM elements
        this.container = document.getElementById('game-container');
        this.marioElement = document.getElementById('mario');
        this.coinCountElement = document.getElementById('coin-count');

        // Configuration
        this.config = GameConfig;

        // Managers
        this.audioManager = new AudioManager(this.config);
        this.uiManager = new UIManager(this.container, this.config);
        this.player = new Player(this.marioElement, this.container, this.config);
        this.inputManager = new InputManager(this.player, this.config);

        // Game state
        this.coinsCollected = 0;
        this.gameContent = null;
        this.boxesContainer = null;
        this.resetModal = null;
        this.isGameOver = false;
        this.victoryTriggered = false;
    }

    /**
     * Initialize and start the game
     */
    initialize() {
        try {
            this.validateDOMElements();
            this.setupGameWorld();
            this.setupManagers();
            this.setupInteractions();
            this.startGameLoop();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    /**
     * Validate required DOM elements exist
     */
    validateDOMElements() {
        if (!this.container || !this.marioElement || !this.coinCountElement) {
            throw new Error('Required DOM elements not found');
        }
    }

    /**
     * Setup game world (containers, boxes, clouds, modal)
     */
    setupGameWorld() {
        this.gameContent = DOMBuilder.createGameContent(this.container);
        this.boxesContainer = DOMBuilder.createBoxesContainer(this.gameContent);

        this.uiManager.createInfoBoxes(this.boxesContainer);
        DOMBuilder.createClouds(this.gameContent, this.config);
        this.resetModal = DOMBuilder.createResetModal(this.container);
    }

    /**
     * Setup all managers
     */
    setupManagers() {
        this.audioManager.initialize();
        this.player.initialize();
        this.inputManager.initialize();

        // Set jump callback for collision checking
        this.inputManager.setJumpCallback(() => {
            this.checkCollisions();
        });
    }

    /**
     * Setup box interactions
     */
    setupInteractions() {
        DOMBuilder.setupBoxInteraction(
            this.uiManager.getInfoBoxes(),
            this.player,
            () => this.checkCollisions(),
            this.config.COLLISION.BOX_PROXIMITY
        );
    }

    /**
     * Start the main game loop
     */
    startGameLoop() {
        this.gameLoop();
    }

    /**
     * Main game loop
     */
    gameLoop() {
        if (!this.isGameOver) {
            this.updatePhysics();
            this.checkCollisions();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update physics (player jump)
     */
    updatePhysics() {
        this.player.updateJump();
        this.player.updateSprites();
    }

    /**
     * Check collisions between player and boxes
     */
    checkCollisions() {
        const boxes = this.uiManager.getInfoBoxes();
        const collisions = CollisionDetector.checkPlayerBoxCollisions(
            this.player,
            boxes
        );

        collisions.forEach(index => {
            if (!this.uiManager.isBoxHit(index)) {
                this.handleBoxHit(index);
            }
        });
    }

    /**
     * Handle when player hits a box
     */
    handleBoxHit(index) {
        this.uiManager.markBoxAsHit(index);
        this.uiManager.showInfo(index);
        this.incrementCoins();

        if (this.isVictoryConditionMet() && !this.victoryTriggered) {
            this.triggerVictory();
        }
    }

    /**
     * Increment coins collected
     */
    incrementCoins() {
        this.coinsCollected++;
        this.updateCoinDisplay();
    }

    /**
     * Update coin count display
     */
    updateCoinDisplay() {
        this.coinCountElement.textContent = this.coinsCollected;
    }

    /**
     * Check if victory condition is met
     */
    isVictoryConditionMet() {
        return this.coinsCollected === this.config.GAME.TOTAL_BOXES;
    }

    /**
     * Trigger victory sequence
     */
    triggerVictory() {
        // Mark that victory is triggered but continue game loop
        this.victoryTriggered = true;

        // Wait for Mario to land
        this.waitForLanding();
    }

    /**
     * Wait for Mario to land before starting victory sequence
     */
    waitForLanding() {
        const checkLanding = () => {
            if (!this.player.getIsJumping()) {
                // Mario has landed, start victory sequence
                this.startVictorySequence();
            } else {
                // Check again in next frame
                requestAnimationFrame(checkLanding);
            }
        };

        checkLanding();
    }

    /**
     * Start the victory animation sequence
     */
    startVictorySequence() {
        // Stop player input but continue physics
        this.inputManager.cleanup();

        // Calculate center position (below 3rd box)
        const containerWidth = this.container.getBoundingClientRect().width;
        const marioWidth = this.marioElement.getBoundingClientRect().width;
        const centerPosition = (containerWidth - marioWidth) / 2;

        // Add walking animation
        this.marioElement.classList.add('walking');

        // Determine direction
        const currentPosition = this.player.getPosition();
        const goingRight = centerPosition > currentPosition;
        this.player.updateDirection(goingRight ? 'right' : 'left');

        // Walk to center
        const walkToCenter = () => {
            const currentPos = this.player.getPosition();
            const distance = Math.abs(centerPosition - currentPos);

            if (distance > 5) {
                // Still need to walk
                if (goingRight) {
                    this.player.position = Math.min(centerPosition, currentPos + this.config.PLAYER.MOVE_SPEED);
                } else {
                    this.player.position = Math.max(centerPosition, currentPos - this.config.PLAYER.MOVE_SPEED);
                }
                this.player.updatePosition();
                requestAnimationFrame(walkToCenter);
            } else {
                // Reached center
                this.player.position = centerPosition;
                this.player.updatePosition();
                this.marioElement.classList.remove('walking');

                // Stop game
                this.isGameOver = true;

                // Change to won pose
                setTimeout(() => {
                    this.marioElement.classList.add('won');

                    // Show victory modal after won pose
                    setTimeout(() => {
                        this.showVictoryModal();
                    }, 2000);
                }, 500);
            }
        };

        walkToCenter();
    }

    /**
     * Show victory modal and play victory music
     */
    showVictoryModal() {
        this.resetModal.style.display = 'flex';
        this.audioManager.playVictoryMusic();
    }

    /**
     * Get current game state
     */
    getGameState() {
        return {
            coinsCollected: this.coinsCollected,
            totalBoxes: this.config.GAME.TOTAL_BOXES,
            isGameOver: this.isGameOver,
            playerPosition: this.player.getPosition()
        };
    }
}
