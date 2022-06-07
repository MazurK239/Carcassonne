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
        top, idTop,
        right, idRight,
        bottom, idBottom,
        left, idLeft,
        imageSrc,
        hasChurch = false,
    ) {
        this.top = { type: top, id: idTop };
        this.bottom = { type: bottom, id: idBottom };
        this.left = { type: left, id: idLeft };
        this.right = { type: right, id: idRight };
        const image = new Image();
        image.src = imageSrc;
        this.image = image;
        this.rotationAngle = 0;
        this.center = hasChurch ? { type: CHURCH, id: 100 } : null
        this.hasChurch = hasChurch;
    }

    getSides() {
        // return this.center ?
        //     { top: this.top, bottom: this.bottom, right: this.right, left: this.left, center: this.center } :
            // { top: this.top, bottom: this.bottom, right: this.right, left: this.left };
        return { top: this.top, bottom: this.bottom, right: this.right, left: this.left };
    }

    static initialTile() {
        return new Tile(CITY, 1, ROAD, 2, FIELD, 3, ROAD, 2, InitialTilePath);
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