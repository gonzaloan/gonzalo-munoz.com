/**
 * UIManager - Manages UI elements and information boxes
 * Single Responsibility: UI creation and display
 */
export class UIManager {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.infoBoxes = [];
        this.infoContents = [];
        this.currentInfoTimeout = null;
    }

    /**
     * Create all info boxes
     */
    createInfoBoxes(boxesContainer) {
        this.config.INFORMATION.forEach((info, index) => {
            const box = this.createBox(info, index);
            const content = this.createInfoContent(info);

            boxesContainer.appendChild(box);
            this.container.appendChild(content);

            this.infoBoxes.push(box);
            this.infoContents.push(content);
        });
    }

    /**
     * Create a single info box
     */
    createBox(info, index) {
        const box = document.createElement('div');
        box.className = 'info-box';
        box.textContent = '?';
        box.dataset.index = index;
        return box;
    }

    /**
     * Create info content element
     */
    createInfoContent(info) {
        const content = document.createElement('div');
        content.className = 'info-content';
        content.innerHTML = `
            <h2>${this.escapeHtml(info.title)}</h2>
            <p>${this.escapeHtml(info.content)}</p>
        `;
        return content;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show information at index
     */
    showInfo(index) {
        this.hideAllInfo();
        this.clearInfoTimeout();

        const infoContent = this.infoContents[index];
        if (infoContent) {
            infoContent.classList.add('active');

            this.currentInfoTimeout = setTimeout(() => {
                this.hideInfo(index);
            }, this.config.GAME.INFO_DISPLAY_DURATION);
        }
    }

    /**
     * Hide information at index
     */
    hideInfo(index) {
        const infoContent = this.infoContents[index];
        if (infoContent) {
            infoContent.classList.remove('active');
        }
    }

    /**
     * Hide all information boxes
     */
    hideAllInfo() {
        this.infoContents.forEach(content => {
            content.classList.remove('active');
        });
    }

    /**
     * Clear current info timeout
     */
    clearInfoTimeout() {
        if (this.currentInfoTimeout) {
            clearTimeout(this.currentInfoTimeout);
            this.currentInfoTimeout = null;
        }
    }

    /**
     * Mark box as hit
     */
    markBoxAsHit(index) {
        const box = this.infoBoxes[index];
        if (box) {
            box.textContent = '!';
            box.classList.add('hit');
        }
    }

    /**
     * Check if box is already hit
     */
    isBoxHit(index) {
        const box = this.infoBoxes[index];
        return box && box.textContent === '!';
    }

    /**
     * Get all info boxes
     */
    getInfoBoxes() {
        return this.infoBoxes;
    }

    /**
     * Get box by index
     */
    getBox(index) {
        return this.infoBoxes[index];
    }
}
