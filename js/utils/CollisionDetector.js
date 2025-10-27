/**
 * CollisionDetector - Handles collision detection logic
 * Single Responsibility: Collision detection algorithms
 */
export class CollisionDetector {
    /**
     * Check if two rectangles are colliding
     */
    static isColliding(rect1, rect2) {
        return !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
        );
    }

    /**
     * Check collision between player and boxes
     */
    static checkPlayerBoxCollisions(player, boxes) {
        const playerRect = player.getBoundingRect();
        const collisions = [];

        boxes.forEach((box, index) => {
            const boxRect = box.getBoundingClientRect();
            if (this.isColliding(playerRect, boxRect)) {
                collisions.push(index);
            }
        });

        return collisions;
    }

    /**
     * Check if player is within proximity of a box
     */
    static isWithinProximity(playerRect, boxRect, proximityDistance) {
        return Math.abs(playerRect.x - boxRect.x) < proximityDistance;
    }
}
