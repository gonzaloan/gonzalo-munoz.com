/**
 * GameConfig - Central configuration for game constants
 * Following Single Responsibility Principle
 */
export const GameConfig = {
    PHYSICS: {
        GRAVITY: 0.6,
        JUMP_FORCE: -7,
        GROUND_LEVEL: 20
    },

    PLAYER: {
        WIDTH: 70,
        HEIGHT: 98,
        INITIAL_POSITION: 100,
        MOVE_SPEED: 20
    },

    GAME: {
        TOTAL_BOXES: 5,
        INFO_DISPLAY_DURATION: 3000
    },

    AUDIO: {
        BACKGROUND_VOLUME: 0.3,
        VICTORY_VOLUME: 0.5
    },

    ANIMATION: {
        MOBILE_CONTROL_INTERVAL: 16
    },

    CLOUDS: {
        COUNT: 3,
        MIN_WIDTH: 80,
        MAX_WIDTH: 180,
        HEIGHT: 40,
        MIN_TOP: 50,
        MAX_TOP: 150,
        MIN_DURATION: 20,
        MAX_DURATION: 30
    },

    COLLISION: {
        BOX_PROXIMITY: 100
    },

    INFORMATION: [
        { title: "About me", content: "Hi! My name is Gonzalo Munoz" },
        { title: "Experience", content: "11+ Years of Experience, Software Engineer / Cloud Engineer / AWS Expert" },
        { title: "Skills", content: "Java, Angular, Golang, AWS, Python" },
        { title: "Certifications", content: "10x AWS Certified, GCP Cloud Engineer, OCA 8" },
        { title: "Contact", content: "gonzaloan.munoz@gmail.com" }
    ]
};