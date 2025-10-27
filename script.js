class CVGame {
    constructor() {
        this.mario = document.getElementById('mario');
        this.container = document.getElementById('game-container');
        this.coinCount = document.getElementById('coin-count');
        this.coins = 0;
        this.position = 100;
        this.isJumping = false;
        this.velocityY = 0;
        this.gravity = 0.6;
        this.jumpForce = -7;
        this.totalBoxes = 5;
        this.boxes = [];
        this.clouds = [];
        this.information = [
            { title: "About me", content: "Hi! My name is Gonzalo Munoz" },
            { title: "Experience", content: "11+ Years of Experience, Software Engineer / Cloud Engineer / AWS Expert" },
            { title: "Skills", content: "Java, Angular, Golang, AWS, Python" },
            { title: "Certifications", content: "10x AWS Certified, GCP Cloud Engineer, OCA 8" },
            { title: "Contact", content: "gonzaloan.munoz@gmail.com" }
        ];

        this.leftButton = document.getElementById('left-arrow');
        this.rightButton = document.getElementById('right-arrow');
        this.leftInterval = null;
        this.rightInterval = null;
        this.init();
    }

    init() {
        this.createGameContent();
        this.createBoxes();
        this.createClouds();
        this.createResetModal();
        this.setupEventListeners();
        this.setupMobileControls();
        this.setupBoxInteraction();
        this.gameLoop();
    }
    createGameContent() {
        const gameContent = document.createElement('div');
        gameContent.className = 'game-content';
        this.container.appendChild(gameContent);
        this.gameContent = gameContent;

        const boxesContainer = document.createElement('div');
        boxesContainer.className = 'boxes-container';
        this.gameContent.appendChild(boxesContainer);
        this.boxesContainer = boxesContainer;
    }
    createBoxes() {
        this.information.forEach((info) => {
            const box = document.createElement('div');
            box.className = 'info-box';
            box.textContent = '?';
            this.boxesContainer.appendChild(box);
            this.boxes.push(box);

            const content = document.createElement('div');
            content.className = 'info-content';
            content.innerHTML = `
                <h2>${info.title}</h2>
                <p>${info.content}</p>
            `;
            this.container.appendChild(content);
        });
    }

    createResetModal() {
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
        this.container.appendChild(modal);
        this.resetModal = modal;
    }
    hitBox(box, index) {
        box.textContent = '!';
        box.classList.add('hit');
        this.coins += 1;
        this.coinCount.textContent = this.coins;

        const infoContent = document.querySelectorAll('.info-content')[index];
        infoContent.classList.add('active');

        setTimeout(() => {
            infoContent.classList.remove('active');
        }, 3000);

        if (this.coins === this.totalBoxes) {
            setTimeout(() => {
                this.showResetModal();
            }, 6000);
        }
    }

    showResetModal() {
        this.resetModal.style.display = 'flex';
        // Opcional: Detener el movimiento del personaje
        this.stopMoving();
    }
    createClouds() {
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = `${80 + Math.random() * 100}px`;
            cloud.style.height = '40px';
            cloud.style.top = `${50 + Math.random() * 100}px`;
            cloud.style.animationDuration = `${20 + Math.random() * 10}s`;
            this.gameContent.appendChild(cloud);
            this.clouds.push(cloud);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(e) {
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            this.moveRight();
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            this.moveLeft();
        } else if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.isJumping) {
            this.jump();
        }
    }

    moveLeft() {
        const containerRect = this.container.getBoundingClientRect();
        const marioRect = this.mario.getBoundingClientRect();
        const minPosition = 0;

        this.position = Math.max(minPosition, this.position - 20);
        this.mario.classList.remove('facing-right');
        this.mario.classList.add('facing-left');
        this.mario.style.left = `${this.position}px`;
        this.checkCollisions();

        if (marioRect.left < containerRect.left) {
            this.position = 0;
            this.mario.style.left = `${this.position}px`;
        }
    }

    moveRight() {
        const containerRect = this.container.getBoundingClientRect();
        const marioRect = this.mario.getBoundingClientRect();
        const maxPosition = containerRect.width - marioRect.width;

        this.position = Math.min(maxPosition, this.position + 20);
        this.mario.classList.remove('facing-left');
        this.mario.classList.add('facing-right');
        this.mario.style.left = `${this.position}px`;
        this.checkCollisions();
        if (marioRect.right > containerRect.right) {
            this.position = maxPosition;
            this.mario.style.left = `${this.position}px`;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = this.jumpForce;
            
            this.mario.classList.add('jumping');
            setTimeout(() => {
                this.mario.classList.remove('jumping');
            }, 500);
        }
    }

    checkCollisions() {
        const marioRect = this.mario.getBoundingClientRect();
        
        this.boxes.forEach((box, index) => {
            const boxRect = box.getBoundingClientRect();
            
            if (this.isColliding(marioRect, boxRect) && box.textContent === '?') {
                this.hitBox(box, index);
            }
        });
    }

    isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                rect1.left > rect2.right || 
                rect1.bottom < rect2.top || 
                rect1.top > rect2.bottom);
    }
    setupMobileControls() {
        this.leftButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.leftInterval = setInterval(() => this.moveLeft(), 16);
        });
        this.leftButton.addEventListener('touchend', () => {
            clearInterval(this.leftInterval);
        });

        this.rightButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.rightInterval = setInterval(() => this.moveRight(), 16);
        });
        this.rightButton.addEventListener('touchend', () => {
            clearInterval(this.rightInterval);
        });

        this.leftButton.addEventListener('mousedown', () => {
            this.leftInterval = setInterval(() => this.moveLeft(), 16);
        });
        this.leftButton.addEventListener('mouseup', () => {
            clearInterval(this.leftInterval);
        });
        this.leftButton.addEventListener('mouseleave', () => {
            clearInterval(this.leftInterval);
        });
        this.rightButton.addEventListener('mousedown', () => {
            this.rightInterval = setInterval(() => this.moveRight(), 16);
        });
        this.rightButton.addEventListener('mouseup', () => {
            clearInterval(this.rightInterval);
        });
        this.rightButton.addEventListener('mouseleave', () => {
            clearInterval(this.rightInterval);
        });
    }

    setupBoxInteraction() {
        this.boxes.forEach((box) => {
            box.addEventListener('click', () => {
                const boxRect = box.getBoundingClientRect();
                const marioRect = this.mario.getBoundingClientRect();
                if (Math.abs(marioRect.x - boxRect.x) < 100) {
                    this.jump();
                    setTimeout(() => {
                        this.checkCollisions();
                    }, 100);
                }
            });

            box.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const boxRect = box.getBoundingClientRect();
                const marioRect = this.mario.getBoundingClientRect();
                
                if (Math.abs(marioRect.x - boxRect.x) < 100) {
                    this.jump();
                    
                    setTimeout(() => {
                        this.checkCollisions();
                    }, 100);
                }
            });
        });
    }
    gameLoop() {
        if (this.isJumping) {
            this.velocityY += this.gravity;
            let currentBottom = parseInt(this.mario.style.bottom || '20');
            currentBottom = parseFloat(currentBottom) - this.velocityY;
            if (currentBottom <= 20) {
                currentBottom = 20;
                this.isJumping = false;
                this.velocityY = 0;
            }
            this.mario.style.bottom = `${currentBottom}%`;
        }
        this.checkCollisions();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

window.addEventListener('load', () => {
    new CVGame();
});