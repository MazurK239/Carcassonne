import { v4 as uuidv4 } from 'uuid';
import { ROAD, CITY, FIELD, CHURCH } from "./constants";

export function getTileWithIds(tile, coords, gridTiles) {
    // duplicate the initial tile
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

    // collect only unique ids and generate UUIDs for them
    const idsMap = new Map();
    idsMap.set(tile.top.id, uuidv4());
    if (tile.top.fieldLeft) {
        idsMap.set(tile.top.fieldLeft, uuidv4());
        idsMap.set(tile.top.fieldRight, uuidv4());
    }
    idsMap.set(tile.left.id, uuidv4());
    if (tile.left.fieldLeft) {
        idsMap.set(tile.left.fieldLeft, uuidv4());
        idsMap.set(tile.left.fieldRight, uuidv4());
    }
    idsMap.set(tile.bottom.id, uuidv4());
    if (tile.bottom.fieldLeft) {
        idsMap.set(tile.bottom.fieldLeft, uuidv4());
        idsMap.set(tile.bottom.fieldRight, uuidv4());
    }
    idsMap.set(tile.right.id, uuidv4());
    if (tile.right.fieldLeft) {
        idsMap.set(tile.right.fieldLeft, uuidv4());
        idsMap.set(tile.right.fieldRight, uuidv4());
    }

    // assign existing ids where needed
    const topTile = gridTiles[`${coords[0] - 1}_${coords[1]}`];
    if (topTile) idsMap.set(tile.top.id, topTile.bottom.id);
    if (topTile?.bottom.type === ROAD) {
        idsMap.set(tile.top.fieldLeft, topTile.bottom.fieldRight);
        idsMap.set(tile.top.fieldRight, topTile.bottom.fieldLeft);
    }
    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    if (leftTile) idsMap.set(tile.left.id, leftTile.right.id);
    if (leftTile?.right.type === ROAD) {
        idsMap.set(tile.left.fieldLeft, leftTile.right.fieldRight);
        idsMap.set(tile.left.fieldRight, leftTile.right.fieldLeft);
    }
    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    if (bottomTile) idsMap.set(tile.bottom.id, bottomTile.top.id);
    if (bottomTile?.top.type === ROAD) {
        idsMap.set(tile.bottom.fieldLeft, bottomTile.top.fieldRight);
        idsMap.set(tile.bottom.fieldRight, bottomTile.top.fieldLeft);
    }
    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    if (rightTile) idsMap.set(tile.right.id, rightTile.left.id);
    if (rightTile?.left.type === ROAD) {
        idsMap.set(tile.right.fieldLeft, rightTile.left.fieldRight);
        idsMap.set(tile.right.fieldRight, rightTile.left.fieldLeft);
    }

    // assign the resulting ids to the new tile
    newTile.top.id = idsMap.get(tile.top.id);
    if (newTile.top.fieldLeft) {
        newTile.top.fieldLeft = idsMap.get(tile.top.fieldLeft);
        newTile.top.fieldRight = idsMap.get(tile.top.fieldRight);
    }
    if (newTile.top.surroundingFields) {
        newTile.top.surroundingFields = newTile.top.surroundingFields.map(id => idsMap.get(id));
    }
    newTile.left.id = idsMap.get(tile.left.id);
    if (newTile.left.fieldLeft) {
        newTile.left.fieldLeft = idsMap.get(tile.left.fieldLeft);
        newTile.left.fieldRight = idsMap.get(tile.left.fieldRight);
    }
    if (newTile.left.surroundingFields) {
        newTile.left.surroundingFields = newTile.left.surroundingFields.map(id => idsMap.get(id));
    }
    newTile.bottom.id = idsMap.get(tile.bottom.id);
    if (newTile.bottom.fieldLeft) {
        newTile.bottom.fieldLeft = idsMap.get(tile.bottom.fieldLeft);
        newTile.bottom.fieldRight = idsMap.get(tile.bottom.fieldRight);
    }
    if (newTile.bottom.surroundingFields) {
        newTile.bottom.surroundingFields = newTile.bottom.surroundingFields.map(id => idsMap.get(id));
    }
    newTile.right.id = idsMap.get(tile.right.id);
    if (newTile.right.fieldLeft) {
        newTile.right.fieldLeft = idsMap.get(tile.right.fieldLeft);
        newTile.right.fieldRight = idsMap.get(tile.right.fieldRight);
    }
    if (newTile.right.surroundingFields) {
        newTile.right.surroundingFields = newTile.right.surroundingFields.map(id => idsMap.get(id));
    }
    if (tile.center) {
        newTile.center = { type: tile.center.type, id: uuidv4() };
    }

    return newTile;
}

export function collectNewObjectsFromTile(tile) {
    const tileObjMap = new Map();
    tileObjMap.set(tile.top.id, tile.top.type);
    if (tile.top.type === ROAD) {
        tileObjMap.set(tile.top.fieldLeft, FIELD);
        tileObjMap.set(tile.top.fieldRight, FIELD);
    }
    tileObjMap.set(tile.left.id, tile.left.type);
    if (tile.left.type === ROAD) {
        tileObjMap.set(tile.left.fieldLeft, FIELD);
        tileObjMap.set(tile.left.fieldRight, FIELD);
    }
    tileObjMap.set(tile.bottom.id, tile.bottom.type);
    if (tile.bottom.type === ROAD) {
        tileObjMap.set(tile.bottom.fieldLeft, FIELD);
        tileObjMap.set(tile.bottom.fieldRight, FIELD);
    }
    tileObjMap.set(tile.right.id, tile.right.type);
    if (tile.right.type === ROAD) {
        tileObjMap.set(tile.right.fieldLeft, FIELD);
        tileObjMap.set(tile.right.fieldRight, FIELD);
    }
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
    if (topTile) {
        if (tile.top.id != topTile.bottom.id) {
            if (tile.top.type === ROAD) {
                obj.roads[topTile.bottom.id] = tile.top.id;
            } else if (tile.top.type === CITY) {
                obj.cities[topTile.bottom.id] = tile.top.id;
            } else if (tile.top.type === FIELD) {
                obj.fields[topTile.bottom.id] = tile.top.id;
            }
        }
        if (tile.top.type === ROAD) {
            if (tile.top.fieldLeft != topTile.bottom.fieldRight) {
                obj.fields[topTile.bottom.fieldRight] = tile.top.fieldLeft;
            }
            if (tile.top.fieldRight != topTile.bottom.fieldLeft) {
                obj.fields[topTile.bottom.fieldLeft] = tile.top.fieldRight;
            }
        }
    }

    const rightTile = gridTiles[`${coords[0]}_${coords[1] + 1}`];
    if (rightTile) {
        if (tile.right.id != rightTile.left.id) {
            if (tile.right.type === ROAD) {
                obj.roads[rightTile.left.id] = tile.right.id;
            } else if (tile.right.type === CITY) {
                obj.cities[rightTile.left.id] = tile.right.id;
            } else if (tile.right.type === FIELD) {
                obj.fields[rightTile.left.id] = tile.right.id;
            }
        }
        if (tile.right.type === ROAD) {
            if (tile.right.fieldLeft != rightTile.left.fieldRight) {
                obj.fields[rightTile.left.fieldRight] = tile.right.fieldLeft;
            }
            if (tile.right.fieldRight != rightTile.left.fieldLeft) {
                obj.fields[rightTile.left.fieldLeft] = tile.right.fieldRight;
            }
        }
    }

    const bottomTile = gridTiles[`${coords[0] + 1}_${coords[1]}`];
    if (bottomTile) {
        if (tile.bottom.id != bottomTile.top.id) {
            if (tile.bottom.type === ROAD) {
                obj.roads[bottomTile.top.id] = tile.bottom.id;
            } else if (tile.bottom.type === CITY) {
                obj.cities[bottomTile.top.id] = tile.bottom.id;
            } else if (tile.bottom.type === FIELD) {
                obj.fields[bottomTile.top.id] = tile.bottom.id;
            }
        }
        if (tile.bottom.type === ROAD) {
            if (tile.bottom.fieldLeft != bottomTile.top.fieldRight) {
                obj.fields[bottomTile.top.fieldRight] = tile.bottom.fieldLeft;
            }
            if (tile.bottom.fieldRight != bottomTile.top.fieldLeft) {
                obj.fields[bottomTile.top.fieldLeft] = tile.bottom.fieldRight;
            }
        }
    }

    const leftTile = gridTiles[`${coords[0]}_${coords[1] - 1}`];
    if (leftTile) {
        if (tile.left.id != leftTile.right.id) {
            if (tile.left.type === ROAD) {
                obj.roads[leftTile.right.id] = tile.left.id;
            } else if (tile.left.type === CITY) {
                obj.cities[leftTile.right.id] = tile.left.id;
            } else if (tile.left.type === FIELD) {
                obj.fields[leftTile.right.id] = tile.left.id;
            }
        }
        if (tile.left.type === ROAD) {
            if (tile.left.fieldLeft != leftTile.right.fieldRight) {
                obj.fields[leftTile.right.fieldRight] = tile.left.fieldLeft;
            }
            if (tile.left.fieldRight != leftTile.right.fieldLeft) {
                obj.fields[leftTile.right.fieldLeft] = tile.left.fieldRight;
            }
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
                if (tile[key]?.fieldLeft === oldId) {
                    tile[key].fieldLeft = collisionsObj[oldId];
                }
                if (tile[key]?.fieldRight === oldId) {
                    tile[key].fieldRight = collisionsObj[oldId];
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