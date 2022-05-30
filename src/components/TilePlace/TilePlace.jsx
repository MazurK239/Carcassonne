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
    determinePlayersToGetScores,
} from "./utils"

import "./TilePlace.css"
import { citiesList, fieldsList, roadsList, updatesAfterResolvingCollisions } from "../../recoil/mapObjects";

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
    const [updatesAfterCollisions, setUpdatesAfterCollisions] = useRecoilState(updatesAfterResolvingCollisions);

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
                if (mapObj.type === ROAD && !finishedMapObjects.roads.some(r => r.id === mapObj.id)) {
                    finishedMapObjects.roads.push(mapObj);
                } else if (mapObj.type === CITY && !finishedMapObjects.cities.some(c => c.id === mapObj.id)) {
                    finishedMapObjects.cities.push(mapObj);
                } else if (mapObj.type === FIELD && !finishedMapObjects.fields.some(f => f.id === mapObj.id)) {
                    finishedMapObjects.fields.push(mapObj);
                }
            }
        })
        // find the finished churches
        // set the finished: true
        setRoads(produce(roads => {
            finishedMapObjects.roads.forEach(road => {
                roads.find(r => r.id === road.id).finished = true;
            });
        }))
        setCities(produce(cities => {
            finishedMapObjects.cities.forEach(city => {
                cities.find(c => c.id === city.id).finished = true;
            });
        }))
        setFields(produce(fields => {
            finishedMapObjects.fields.forEach(field => {
                fields.find(f => f.id === field.id).finished = true;
            });
        }))
        // return meeples and add score
        setPlayers(produce(players => {
            finishedMapObjects.roads.forEach(road => {
                if (Object.keys(road.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(road.players);
                    Object.keys(road.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        player.meeples += road.players[id];
                        if (winnerIds.includes(id)) player.score += road.tileCoords.length;    
                    })
                }
            })
            finishedMapObjects.cities.forEach(city => {
                if (Object.keys(city.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(city.players);
                    Object.keys(city.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        player.meeples += city.players[id];
                        if (winnerIds.includes(id)) player.score += city.tileCoords.length * 2;    
                    })
                }
            })
        }))
    }

    const resolveCollisions = function (tile) {
        const collisions = collectCollisionsFromTile(tile, coords, gridTiles);
        resolveCollisionsInTheListOfMapObjects(collisions.roads, setRoads);
        resolveCollisionsInTheListOfMapObjects(collisions.cities, setCities);
        resolveCollisionsInTheListOfMapObjects(collisions.fields, setFields);
        resolveCollisionsInTheGridTiles(collisions);
        setUpdatesAfterCollisions({
            ...collisions.roads, 
            ...collisions.cities, 
            ...collisions.fields, 
            ...updatesAfterCollisions
        });
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
                // add the new object with the updated coordinates and players
                const tempObj = 
                { 
                    ...newMapObj, 
                        ...newMapObj, 
                    ...newMapObj, 
                        ...newMapObj, 
                    ...newMapObj, 
                    tileCoords: [...newMapObj.tileCoords, ...oldMapObj.tileCoords],
                    players: {...newMapObj.players},
                }
                Object.keys(oldMapObj.players).forEach(playerId => {
                    if (tempObj.players[playerId]) {
                        tempObj.players[playerId]++;
                    } else {
                        tempObj.players[playerId] = 1;
                    }
                })
                objectsToReturn.push(tempObj);
            })
            return objectsToReturn;
        }))
    }

    // change ids on the placed meeples after the collisions are resolved
    useEffect(() => {
        if (meeple && updatesAfterCollisions[meeple.objectId]) {
            setMeeple({...meeple, objectId: updatesAfterCollisions[meeple.objectId]});
        }
    }, [updatesAfterCollisions])

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
                    objects.push({ id, type, tileCoords: [coords], players: {}, finished: false });
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
            [roads, cities].forEach(objList =>
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
        let scoreToAdd = 0;
        if (tileInPlace[side].type === ROAD) {
            setRoads(produce((roads) => {
                const road = roads.find(r => r.id == tileInPlace[side].id);
                road.players[player.id] = 1;
                if (road.finished) {
                    returnMeeple = true;
                    scoreToAdd = road.tileCoords.length;
                }
            }))
        } else if (tileInPlace[side].type === CITY) {
            setCities(produce((cities) => {
                const city = cities.find(c => c.id == tileInPlace[side].id);
                city.players[player.id] = 1;
                if (city.finished) {
                    returnMeeple = true;
                    scoreToAdd = city.tileCoords.length * 2;
                }
            }))
        } else if (tileInPlace[side].type === FIELD) {
            setFields(produce((fields) => {
                fields.find(f => f.id == tileInPlace[side].id).players[player.id] = 1;
            }))
        }
        // place meeple or increase score
        if (!returnMeeple) {
            setPlayers(produce((players) => { players[player.indexInArray].meeples-- }));
        } else {
            setPlayers(produce((players) => { players[player.indexInArray].score += scoreToAdd }));
        }
    }

    const canPlaceMeeple = function (side) {
        if (players[player.indexInArray].meeples === 0) return false;
        if (side.type === ROAD) {
            return Object.keys(roads.find(road => road.id == side.id).players).length === 0
        } else if (side.type === CITY) {
            return Object.keys(cities.find(city => city.id == side.id).players).length === 0
        } else if (side.type === FIELD) {
            return Object.keys(fields.find(field => field.id == side.id).players).length === 0
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