import { ROAD, CITY, FIELD } from "../constants"
import InitialTilePath from "../images/startingTile.jpeg"

export default class Tile {

    top;
    bottom;
    left;
    right;
    image;
    rotationAngle;

    constructor(
        top, 
        idTop, 
        right, 
        idRight, 
        bottom, 
        idBottom, 
        left, 
        idLeft, 
        imageSrc
    ) {
        this.top = {type: top, id: idTop};
        this.bottom = {type: bottom, id: idBottom};
        this.left = {type: left, id: idLeft};
        this.right = {type: right, id: idRight};
        const image = new Image();
        image.src = imageSrc;
        this.image = image;
        this.rotationAngle = 0;
    }

    static initialTile() {
        return new Tile(CITY, 1, ROAD, 2, FIELD, 3, ROAD, 2, InitialTilePath);
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
            right: tile.bottom,
            bottom: tile.left,
            left: tile.top,
            image: tile.image,
            rotationAngle: tile.rotationAngle - 90,
        }
    }
}