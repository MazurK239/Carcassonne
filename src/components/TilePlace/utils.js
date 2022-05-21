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

export function collectCollisionsFromTile(tile, coords, gridTiles) {
    const obj = {roads: {}, cities: {}, fields: {}};
    const topTile = gridTiles[`${coords[0] - 1}_${coords[1]}`];
    if (topTile && tile.idTop != topTile.idBottom) {
        if (tile.top === ROAD) {
            obj.roads[topTile.idBottom] = tile.idTop;
        } else if (tile.top === CITY) {
            obj.cities[topTile.idBottom] = tile.idTop;
        } else if (tile.top === FIELD) {
            obj.fields[topTile.idBottom] = tile.idTop;
        }
    }

    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    if (rightTile && tile.idRight != rightTile.idLeft) {
        if (tile.right === ROAD) {
            obj.roads[rightTile.idLeft] = tile.idRight;
        } else if (tile.right === CITY) {
            obj.cities[rightTile.idLeft] = tile.idRight;
        } else if (tile.right === FIELD) {
            obj.fields[rightTile.idLeft] = tile.idRight;
        }
    }

    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    if (bottomTile && tile.idBottom != bottomTile.idTop) {
        if (tile.bottom === ROAD) {
            obj.roads[bottomTile.idTop] = tile.idBottom;
        } else if (tile.bottom === CITY) {
            obj.cities[bottomTile.idTop] = tile.idBottom;
        } else if (tile.bottom === FIELD) {
            obj.fields[bottomTile.idTop] = tile.idBottom;
        }
    }

    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    if (leftTile && tile.idLeft != leftTile.idRight) {
        if (tile.left === ROAD) {
            obj.roads[leftTile.idRight] = tile.idLeft;
        } else if (tile.left === CITY) {
            obj.cities[leftTile.idRight] = tile.idLeft;
        } else if (tile.left === FIELD) {
            obj.fields[leftTile.idRight] = tile.idLeft;
        }
    }
    return obj;
}

export function getTilesWithResolvedCollisions(collisionsObj, tiles) {
    Object.keys(collisionsObj).forEach(oldId => {
        Object.values(tiles).forEach(tile => {
            Object.keys(tile).forEach(key => {
                if (tile[key] === oldId) {
                    tile[key] = collisionsObj[oldId];
                }
            })
        })
    })
}