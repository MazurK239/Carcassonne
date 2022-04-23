import { ROAD, CITY, FIELD } from "../constants"
import InitialTilePath from "../images/startingTile.jpeg"

export default class Tile {

    top;
    bottom;
    left;
    right;
    image;
    rotationAngle;

    constructor(top, right, bottom, left, imageSrc) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        const image = new Image();
        image.src = imageSrc;
        this.image = image;
        this.rotationAngle = 0;
    }

    static initialTile() {
        return new Tile(CITY, ROAD, FIELD, ROAD, InitialTilePath);
    }

    static rotateClockwise(tile) {
        return {
            top: tile.left,
            left: tile.bottom,
            bottom: tile.right,
            right: tile.top,
            image: tile.image,
            rotationAngle: tile.rotationAngle + 90,
        }
    }

    static rotateCounterClockwise(tile) {
        return {
            top: tile.right,
            left: tile.bottom,
            bottom: tile.left,
            right: tile.top,
            image: tile.image,
            rotationAngle: tile.rotationAngle - 90,
        }
    }
}