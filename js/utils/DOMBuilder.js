/**
 * DOMBuilder - Utility for building DOM elements
 * Single Responsibility: DOM element creation
 */
export class DOMBuilder {
    /**
     * Create game content container
     */
    static createGameContent(container) {
        const gameContent = document.createElement('div');
        gameContent.className = 'game-content';
        container.appendChild(gameContent);
        return gameContent;
    }

    /**
     * Create boxes container
     */
    static createBoxesContainer(parent) {
        const boxesContainer = document.createElement('div');
        boxesContainer.className = 'boxes-container';
        parent.appendChild(boxesContainer);
        return boxesContainer;
    }

    /**
     * Create clouds
     */
    static createClouds(parent, config) {
        const clouds = [];

        for (let i = 0; i < config.CLOUDS.COUNT; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';

            const width = config.CLOUDS.MIN_WIDTH +
                Math.random() * (config.CLOUDS.MAX_WIDTH - config.CLOUDS.MIN_WIDTH);
            const top = config.CLOUDS.MIN_TOP +
                Math.random() * (config.CLOUDS.MAX_TOP - config.CLOUDS.MIN_TOP);
            const duration = config.CLOUDS.MIN_DURATION +
                Math.random() * (config.CLOUDS.MAX_DURATION - config.CLOUDS.MIN_DURATION);

            cloud.style.width = `${width}px`;
            cloud.style.height = `${config.CLOUDS.HEIGHT}px`;
            cloud.style.top = `${top}px`;
            cloud.style.animationDuration = `${duration}s`;

            parent.appendChild(cloud);
            clouds.push(cloud);
        }

        return clouds;
    }

    /**
     * Create reset/victory modal
     */
    static createResetModal(container) {
        const modal = document.createElement('div');
        modal.className = 'reset-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="reset-content">
                <a href="https://www.linkedin.com/in/mmgonzalo" target="_blank">
                    <img src="./img/linkedin.png" alt="Lets Contact" class="win-gif">
                </a>
                <p>The end!</p>
                <button class="restart-button" onclick="location.reload()">Restart</button>
            </div>
        `;
        container.appendChild(modal);
        return modal;
    }

    /**
     * Setup box interaction (click/touch to jump)
     */
    static setupBoxInteraction(boxes, player, onJumpCallback, proximityDistance) {
        boxes.forEach((box) => {
            // Click event
            box.addEventListener('click', () => {
                this.handleBoxClick(box, player, onJumpCallback, proximityDistance);
            });

            // Touch event
            box.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleBoxClick(box, player, onJumpCallback, proximityDistance);
            });
        });
    }

    /**
     * Handle box click/touch
     */
    static handleBoxClick(box, player, onJumpCallback, proximityDistance) {
        const boxRect = box.getBoundingClientRect();
        const playerRect = player.getBoundingRect();

        if (Math.abs(playerRect.x - boxRect.x) < proximityDistance) {
            player.jump();
            if (onJumpCallback) {
                setTimeout(onJumpCallback, 100);
            }
        }
    }
}
