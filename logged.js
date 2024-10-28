class Logged {
    constructor() {
        this.clouds = [];
        this.container = document.getElementById('game-container');
        this.init();
    }

    init() {
        this.createClouds();
    }

    createClouds() {
        for (let i = 0; i < 3; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = `${80 + Math.random() * 100}px`;
            cloud.style.height = '40px';
            cloud.style.top = `${50 + Math.random() * 100}px`;
            cloud.style.animationDuration = `${20 + Math.random() * 10}s`;
            this.container.appendChild(cloud);
            this.clouds.push(cloud);
        }
    }
}

window.addEventListener('load', () => {
    new Logged();
});