import { v4 as uuidv4 } from 'uuid';
import { ROAD, CITY, FIELD, CHURCH } from "./constants";

export function getTileWithIds(tile, coords, gridTiles) {
    const newTile = {
        ...tile,
        top: { ...tile.top },
        bottom: { ...tile.bottom },
        left: { ...tile.left },
        right: { ...tile.right },
    };
    newTile.getSides = function () {
        return { top: this.top, bottom: this.bottom, right: this.right, left: this.left }
    };
    const idsMap = new Map();

    idsMap.set(tile.top.id, uuidv4());
    idsMap.set(tile.left.id, uuidv4());
    idsMap.set(tile.bottom.id, uuidv4());
    idsMap.set(tile.right.id, uuidv4());

    const topTile = gridTiles[`${coords[0] - 1}_${coords[1]}`];
    if (topTile) idsMap.set(tile.top.id, topTile.bottom.id);
    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    if (leftTile) idsMap.set(tile.left.id, leftTile.right.id);
    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    if (bottomTile) idsMap.set(tile.bottom.id, bottomTile.top.id);
    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    if (rightTile) idsMap.set(tile.right.id, rightTile.left.id);
    
    newTile.top.id = idsMap.get(tile.top.id);
    newTile.left.id = idsMap.get(tile.left.id);
    newTile.bottom.id = idsMap.get(tile.bottom.id);
    newTile.right.id = idsMap.get(tile.right.id);
    if (tile.center) {
        newTile.center = { type: tile.center.type, id: uuidv4() };
        // newTile.getSides = function () {
        //     return { top: this.top, bottom: this.bottom, right: this.right, left: this.left, center: this.center }
        // };  
    }

    return newTile;
}

export function collectNewObjectsFromTile(tile) {
    const tileObjMap = new Map();
    tileObjMap.set(tile.top.id, tile.top.type);
    tileObjMap.set(tile.left.id, tile.left.type);
    tileObjMap.set(tile.bottom.id, tile.bottom.type);
    tileObjMap.set(tile.right.id, tile.right.type);
    if (tile.center) {
        tileObjMap.set(tile.center.id, tile.center.type);
    }
    const obj = {
        newRoads: [],
        newCities: [],
        newFields: [],
        newChurches: [],
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
                break;
            case CHURCH:
                obj.newChurches.push(id);
        }
    })
    return obj
}

export function collectCollisionsFromTile(tile, coords, gridTiles) {
    const obj = { roads: {}, cities: {}, fields: {} };
    const topTile = gridTiles[`${coords[0] - 1}_${coords[1]}`];
    if (topTile && tile.top.id != topTile.bottom.id) {
        if (tile.top.type === ROAD) {
            obj.roads[topTile.bottom.id] = tile.top.id;
        } else if (tile.top.type === CITY) {
            obj.cities[topTile.bottom.id] = tile.top.id;
        } else if (tile.top.type === FIELD) {
            obj.fields[topTile.bottom.id] = tile.top.id;
        }
    }

    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    if (rightTile && tile.right.id != rightTile.left.id) {
        if (tile.right.type === ROAD) {
            obj.roads[rightTile.left.id] = tile.right.id;
        } else if (tile.right.type === CITY) {
            obj.cities[rightTile.left.id] = tile.right.id;
        } else if (tile.right.type === FIELD) {
            obj.fields[rightTile.left.id] = tile.right.id;
        }
    }

    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    if (bottomTile && tile.bottom.id != bottomTile.top.id) {
        if (tile.bottom.type === ROAD) {
            obj.roads[bottomTile.top.id] = tile.bottom.id;
        } else if (tile.bottom.type === CITY) {
            obj.cities[bottomTile.top.id] = tile.bottom.id;
        } else if (tile.bottom.type === FIELD) {
            obj.fields[bottomTile.top.id] = tile.bottom.id;
        }
    }

    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    if (leftTile && tile.left.id != leftTile.right.id) {
        if (tile.left.type === ROAD) {
            obj.roads[leftTile.right.id] = tile.left.id;
        } else if (tile.left.type === CITY) {
            obj.cities[leftTile.right.id] = tile.left.id;
        } else if (tile.left.type === FIELD) {
            obj.fields[leftTile.right.id] = tile.left.id;
        }
    }
    return obj;
}

export function getTilesWithResolvedCollisions(collisionsObj, tiles) {
    Object.keys(collisionsObj).forEach(oldId => {
        Object.values(tiles).forEach(tile => {
            Object.keys(tile).forEach(key => {
                if (tile[key]?.id === oldId) {
                    tile[key].id = collisionsObj[oldId];
                }
            })
        })
    })
}

export function getMapObjBySide(side, roads, cities, fields) {
    if (side.type === ROAD) {
        return roads.find(road => road.id === side.id);
    } else if (side.type === CITY) {
        return cities.find(city => city.id === side.id);
    } else if (side.type === FIELD) {
        return fields.find(field => field.id === side.id);
    } else return null;
}

export function isFinished(mapObj, tilesInGrid) {
    let finished = true;
    for (let tileCoords of mapObj.tileCoords) {
        const tile = tilesInGrid[`${tileCoords[0]}_${tileCoords[1]}`];
        if (
            tile.top.id === mapObj.id && !mapObj.tileCoords.some(c => c[0] === tileCoords[0] - 1 && c[1] === tileCoords[1]) ||
            tile.bottom.id === mapObj.id && !mapObj.tileCoords.some(c => c[0] === tileCoords[0] + 1 && c[1] === tileCoords[1]) ||
            tile.left.id === mapObj.id && !mapObj.tileCoords.some(c => c[0] === tileCoords[0] && c[1] === tileCoords[1] - 1) ||
            tile.right.id === mapObj.id && !mapObj.tileCoords.some(c => c[0] === tileCoords[0] && c[1] === tileCoords[1] + 1)
        ) {
            finished = false;
            break;
        }
    }
    return finished;
}

export function isChurchFinished(church, gridTiles) {
    const coords = church.tileCoords[0];
    return (
        gridTiles[`${coords[0] - 1}_${coords[1] - 1}`] &&
        gridTiles[`${coords[0] - 1}_${coords[1]}`] &&
        gridTiles[`${coords[0] - 1}_${coords[1] + 1}`] &&
        gridTiles[`${coords[0]}_${coords[1] - 1}`] &&
        gridTiles[`${coords[0]}_${coords[1] + 1}`] &&
        gridTiles[`${coords[0] + 1}_${coords[1] - 1}`] &&
        gridTiles[`${coords[0] + 1}_${coords[1]}`] &&
        gridTiles[`${coords[0] + 1}_${coords[1] + 1}`]
    )
}

export function determinePlayersToGetScores(playersObj) {
    const playerIds = [];
    const maxMeeplesOnObject = Object.values(playersObj).sort((a, b) => b - a)[0];
    Object.keys(playersObj).forEach(id => {
        if (playersObj[id] === maxMeeplesOnObject) {
            playerIds.push(id);
        }
    })
    return playerIds;
}