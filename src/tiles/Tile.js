import { ROAD, CITY, FIELD, CHURCH } from "../constants"
import InitialTilePath from "../images/startingTile.jpeg"

export default class Tile {

    top;
    bottom;
    left;
    right;
    center;
    image;
    rotationAngle;
    hasChurch;

    constructor(
        top,
        right,
        bottom,
        left,
        imageSrc,
        hasChurch = false,
    ) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        const image = new Image();
        image.src = imageSrc;
        this.image = image;
        this.rotationAngle = 0;
        this.center = hasChurch ? { type: CHURCH, id: 100 } : null
        this.hasChurch = hasChurch;
    }

    getSides() {
        return { top: this.top, bottom: this.bottom, right: this.right, left: this.left };
    }

    static initialTile() {
        return new Tile({type: CITY, id: 1, surroundingFields: [4]}, {type: ROAD, id: 2, fieldLeft: 3, fieldRight: 4}, {type: FIELD, id: 3}, {type: ROAD, id: 2, fieldLeft: 4, fieldRight: 3}, InitialTilePath);
    }

    static rotateClockwise(tile) {
        return {
            ...tile,
            top: tile.left,
            left: tile.bottom,
            bottom: tile.right,
            right: tile.top,
            rotationAngle: tile.rotationAngle + 90,
        }
    }

    static rotateCounterClockwise(tile) {
        return {
            ...tile,
            top: tile.right,
            right: tile.bottom,
            bottom: tile.left,
            left: tile.top,
            rotationAngle: tile.rotationAngle - 90,
        }
    }
}