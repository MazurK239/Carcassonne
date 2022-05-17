import { v4 as uuidv4 } from 'uuid';
import { ROAD, CITY, FIELD } from "../../constants";

export function getTileWithIds(tile, coords, gridTiles) {
    const newTile = { ...tile };
    const idsMap = new Map();

    idsMap.set(tile.idTop, uuidv4());
    idsMap.set(tile.idLeft, uuidv4());
    idsMap.set(tile.idBottom, uuidv4());
    idsMap.set(tile.idRight, uuidv4());

    const topTile = gridTiles[`${coords[0] - 1}_${coords[1]}`];
    if (topTile) idsMap.set(tile.idTop, topTile.idBottom);
    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    if (leftTile) idsMap.set(tile.idLeft, leftTile.idRight);
    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    if (bottomTile) idsMap.set(tile.idBottom, bottomTile.idTop);
    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    if (rightTile) idsMap.set(tile.idRight, rightTile.idLeft);

    newTile.idTop = idsMap.get(tile.idTop);
    newTile.idLeft = idsMap.get(tile.idLeft);
    newTile.idBottom = idsMap.get(tile.idBottom);
    newTile.idRight = idsMap.get(tile.idRight);

    return newTile;
}

export function collectNewObjectsFromTile(tile) {
    const tileObjMap = new Map();
    tileObjMap.set(tile.idTop, tile.top);
    tileObjMap.set(tile.idLeft, tile.left);
    tileObjMap.set(tile.idBottom, tile.bottom);
    tileObjMap.set(tile.idRight, tile.right);
    const obj = { 
        newRoads: [], 
        newCities: [], 
        newFields: [] 
    };

    tileObjMap.forEach((objType, id) => {
        switch (objType) {
            case ROAD:
                obj.newRoads.push(id);
                break;
            case CITY:
                obj.newCities.push(id);
                break;
            case FIELD:
                obj.newFields.push(id);
        }
    })
    return obj
} 