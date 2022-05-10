import { ROAD, CITY, FIELD } from "../constants"
import InitialTilePath from "../images/startingTile.jpeg"

export default class Tile {

    top;
    idTop;
    bottom;
    idBottom;
    left;
    idLeft;
    right;
    idRight;
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
        this.top = top;
        this.idTop = idTop;
        this.bottom = bottom;
        this.idBottom = idBottom;
        this.left = left;
        this.idLeft = idLeft;
        this.right = right;
        this.idRight = idRight;
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
            idTop: tile.idLeft,
            idLeft: tile.idBottom,
            idBottom: tile.idRight,
            idRight: tile.idTop,
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
            idTop: tile.idRight,
            idRight: tile.idBottom,
            idBottom: tile.idLeft,
            idLeft: tile.idTop,
            image: tile.image,
            rotationAngle: tile.rotationAngle - 90,
        }
    }
}