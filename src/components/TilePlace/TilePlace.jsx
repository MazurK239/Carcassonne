import produce from "immer";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
    PLACE_MEEPLE,
    PLACE_TILE,
    ROAD,
    CITY,
    FIELD
} from "../../constants";
import { gameState } from "../../recoil/game";
import { gridParams, tilesInGrid } from "../../recoil/grid";
import { nextTile, tileIndex } from "../../recoil/tiles";
import { playersList, activePlayer } from "../../recoil/players";
import PlaceMeepleZone from "./PlaceMeepleZone";
import MeepleOnTile from "./MeepleOnTile";
import {
    getTileWithIds,
    collectNewObjectsFromTile,
    collectCollisionsFromTile,
    getTilesWithResolvedCollisions,
    getMapObjBySide,
    isFinished,
} from "./utils"

import "./TilePlace.css"
import { citiesList, fieldsList, roadsList } from "../../recoil/mapObjects";

export default function TilePlace({
    coords,
    size
}) {
    const tile = useRecoilValue(nextTile);
    const [tileIdx, setTileIdx] = useRecoilState(tileIndex);
    const [grid, setGridParams] = useRecoilState(gridParams);
    const [gridTiles, setTilesInGrid] = useRecoilState(tilesInGrid);
    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const [players, setPlayers] = useRecoilState(playersList);
    const [player, setActivePlayer] = useRecoilState(activePlayer);

    const [roads, setRoads] = useRecoilState(roadsList);
    const [fields, setFields] = useRecoilState(fieldsList);
    const [cities, setCities] = useRecoilState(citiesList);

    const [tileInPlace, setTileInPlace] = useState(null);
    const [valid, setValid] = useState(false);
    const [readyForMeeple, setReadyForMeeple] = useState(false);
    const [meeple, setMeeple] = useState(null);

    const placeTile = function () {
        if (tile && valid && !tileInPlace) {
            const tileToPlace = getTileWithIds(tile, coords, gridTiles);
            // add new assets and update the existing ones
            updateMapObjects(tileToPlace);
            resolveCollisions(tileToPlace);
            setTileInPlace(tileToPlace);
            setTileIdx(tileIdx + 1);
            setTilesInGrid(
                produce((tiles) => {
                    tiles[`${coords[0]}_${coords[1]}`] = tileToPlace;
                })
            )
            addRows();
            addCols();
        }
    }

    // finish map objects and get ready to place meeple
    useEffect(() => {
        if (tileInPlace) {
            handleAssetsFinish(tileInPlace);
            setGameStatus(PLACE_MEEPLE);
            setReadyForMeeple(true);
            console.log('before placing meeple')
            console.log('roads', roads);
            console.log('cities', cities);
            console.log('fields', fields);
        }
    }, [tileInPlace])

    const handleAssetsFinish = function (tile) {
        // find the finished assets
        const finishedMapObjects = { roads: [], cities: [], fields: [] };
        Object.values(tile.getSides()).forEach(side => {
            const mapObj = getMapObjBySide(side, roads, cities, fields);
            if (isFinished(mapObj, gridTiles)) {
                if (mapObj.type === ROAD) {
                    finishedMapObjects.roads.push(mapObj);
                } else if (mapObj.type === CITY) {
                    finishedMapObjects.cities.push(mapObj);
                } else if (mapObj.type === FIELD) {
                    finishedMapObjects.fields.push(mapObj);
                }
            }
        })
        // find the finished churches
        // set the finished: true and remove player
        setRoads(produce(roads => {
            finishedMapObjects.roads.forEach(road => {
                roads.find(r => r.id === road.id).finished = true;
                // roads.find(r => r.id === road.id).player = null;
            });
        }))
        setCities(produce(cities => {
            finishedMapObjects.cities.forEach(city => {
                cities.find(c => c.id === city.id).finished = true;
                // cities.find(c => c.id === city.id).player = null;
            });
        }))
        setFields(produce(fields => {
            finishedMapObjects.fields.forEach(field => {
                fields.find(f => f.id === field.id).finished = true;
                // fields.find(f => f.id === field.id).player = null;
            });
        }))
        // return meeples
        setPlayers(produce(players => {
            Object.values(finishedMapObjects).forEach(objType =>
                objType.forEach(obj => {
                    const player = players.find(p => p.id === obj.player)
                    if (player) player.meeples++;
                })
            );
        }))
    }

    const resolveCollisions = function (tile) {
        const collisions = collectCollisionsFromTile(tile, coords, gridTiles);
        resolveCollisionsInTheListOfMapObjects(collisions.roads, setRoads);
        resolveCollisionsInTheListOfMapObjects(collisions.cities, setCities);
        resolveCollisionsInTheListOfMapObjects(collisions.fields, setFields);
        resolveCollisionsInTheGridTiles(collisions);
    }

    const resolveCollisionsInTheListOfMapObjects = function (newObjects, setter) {
        setter(produce(objects => {
            let objectsToReturn = objects;
            // for each of the ids to replace
            Object.keys(newObjects).forEach((oldId) => {
                // we find the object with the old id
                const oldMapObj = objects.find(obj => obj.id === oldId);
                // find an object with the correct id
                const newMapObj = objects.find(obj => obj.id === newObjects[oldId]);
                // remove them from the list of objects
                objectsToReturn = objects.filter(obj => (obj.id != oldId) && (obj.id != newObjects[oldId]));
                // add the new object with the updated coordinates
                objectsToReturn.push(
                    { ...newMapObj, tileCoords: [...newMapObj.tileCoords, ...oldMapObj.tileCoords] }
                );
            })
            return objectsToReturn;
        }))
    }

    const resolveCollisionsInTheGridTiles = function (collisions) {
        setTilesInGrid(produce(tiles => {
            getTilesWithResolvedCollisions(collisions.roads, tiles);
            getTilesWithResolvedCollisions(collisions.cities, tiles);
            getTilesWithResolvedCollisions(collisions.fields, tiles);
        }))
    }

    const updateMapObjects = function (tile) {
        const objects = collectNewObjectsFromTile(tile);
        updateObjects(objects.newRoads, setRoads, ROAD);
        updateObjects(objects.newCities, setCities, CITY);
        updateObjects(objects.newFields, setFields, FIELD);
    }

    const updateObjects = function (newObjects, setter, type) {
        setter(produce(objects => {
            newObjects.forEach(id => {
                if (objects.find(obj => obj.id === id)) {
                    const obj = objects.find(obj => obj.id === id);
                    obj.tileCoords.push(coords);
                } else {
                    objects.push({ id, type, tileCoords: [coords], player: null, finished: false });
                }
            })
        }))
    }

    const addRows = function () {
        if (coords[0] === grid.topLeftIdx[0]) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.topLeftIdx[0]--;
                    gridParams.rows++;
                })
            )
        } else if (coords[0] === grid.topLeftIdx[0] + grid.rows - 1) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.rows++;
                })
            )
        }
    }

    const addCols = function () {
        if (coords[1] === grid.topLeftIdx[1]) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.topLeftIdx[1]--;
                    gridParams.columns++;
                })
            )
        } else if (coords[1] === grid.topLeftIdx[1] + grid.columns - 1) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.columns++;
                })
            )
        }
    }

    // calclate valid places to put tiles
    useEffect(() => {
        if (gameStatus != PLACE_TILE || tileInPlace || !tile) {
            setValid(false);
            return;
        }
        if (!Object.keys(gridTiles).length) {
            setValid(true);
            return;
        }
        if (
            !gridTiles[`${coords[0] - 1}_${coords[1]}`] &&
            !gridTiles[`${coords[0] + 1}_${coords[1]}`] &&
            !gridTiles[`${coords[0]}_${coords[1] - 1}`] &&
            !gridTiles[`${coords[0]}_${coords[1] + 1}`]
        ) {
            setValid(false);
        } else if (
            (!gridTiles[`${coords[0] - 1}_${coords[1]}`] || gridTiles[`${coords[0] - 1}_${coords[1]}`].bottom.type === tile.top.type) &&
            (!gridTiles[`${coords[0] + 1}_${coords[1]}`] || gridTiles[`${coords[0] + 1}_${coords[1]}`].top.type === tile.bottom.type) &&
            (!gridTiles[`${coords[0]}_${coords[1] - 1}`] || gridTiles[`${coords[0]}_${coords[1] - 1}`].right.type === tile.left.type) &&
            (!gridTiles[`${coords[0]}_${coords[1] + 1}`] || gridTiles[`${coords[0]}_${coords[1] + 1}`]?.left.type === tile.right.type)
        ) {
            setValid(true);
        } else {
            setValid(false);
        }
    }, [tile, gameStatus])

    // remove meeple zones from the tile
    useEffect(() => {
        if (gameStatus === PLACE_TILE) {
            setReadyForMeeple(false);
        }
    }, [gameStatus])

    // delete meeple from tile if it is on the finished object
    useEffect(() => {
        if (meeple) {
            [roads, cities, fields].forEach(objList =>
                objList.forEach(obj => {
                    if (obj.finished && 
                        obj.tileCoords.some(c => c[0] === coords[0] && c[1] === coords[1]) &&
                        obj.id === meeple.objectId
                    ) {
                        setMeeple(null);
                    }
                })
            )
        }
    }, [roads, cities, fields]);

    const handleZoneClick = function (side) {
        setMeeple({ color: player.color, position: side, objectId: tileInPlace[side].id });
        addPlayerToMapObject(side);
        setActivePlayer(players[(player.indexInArray + 1) % players.length]);
        setGameStatus(PLACE_TILE);
    }

    const addPlayerToMapObject = function (side) {
        // we need to return meeple immediately if it is placed on the just finished object
        let returnMeeple = false;
        if (tileInPlace[side].type === ROAD) {
            setRoads(produce((roads) => {
                const road = roads.find(r => r.id == tileInPlace[side].id);
                road.player = player.id;
                if (road.finished) {
                    returnMeeple = true;
                }
            }))
        } else if (tileInPlace[side].type === CITY) {
            setCities(produce((cities) => {
                const city = cities.find(c => c.id == tileInPlace[side].id);
                city.player = player.id;
                if (city.finished) {
                    returnMeeple = true;
                }
            }))
        } else if (tileInPlace[side].type === FIELD) {
            setFields(produce((fields) => {
                const field = fields.find(f => f.id == tileInPlace[side].id);
                field.player = player.id;
                if (field.finished) {
                    returnMeeple = true;
                }
            }))
        }
        if (!returnMeeple) {
            setPlayers(produce((players) => { players[player.indexInArray].meeples-- }));
        }
    }

    const canPlaceMeeple = function (side) {
        if (players[player.indexInArray].meeples === 0) return false;
        if (side.type === ROAD) {
            return roads.find(road => road.id == side.id).player === null
        } else if (side.type === CITY) {
            return cities.find(city => city.id == side.id).player === null
        } else if (side.type === FIELD) {
            return fields.find(field => field.id == side.id).player === null
        }
    }

    return (
        <div
            className={valid ? "tile valid-tile" : "tile"}
            onClick={placeTile}
            style={{ width: size, height: size }}
        >
            {
                tileInPlace &&
                <img
                    src={tileInPlace.image.src}
                    style={{
                        width: size - 2,
                        height: size - 2,
                        transform: "rotate(" + tileInPlace.rotationAngle + "deg)"
                    }}
                />
            }
            {
                readyForMeeple &&
                <PlaceMeepleZone
                    tileSize={size}
                    onZoneClick={handleZoneClick}
                    showSide={{
                        top: canPlaceMeeple(tileInPlace.top),
                        left: canPlaceMeeple(tileInPlace.left),
                        bottom: canPlaceMeeple(tileInPlace.bottom),
                        right: canPlaceMeeple(tileInPlace.right),
                    }}
                />
            }
            {
                meeple &&
                <MeepleOnTile tileSize={size} color={meeple.color} position={meeple.position} />
            }
        </div>
    );
}