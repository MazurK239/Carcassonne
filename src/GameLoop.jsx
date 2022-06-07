import React, { useEffect, useState } from "react";
import produce from "immer";
import { useRecoilState, useRecoilValue } from "recoil";
import { lastPlacedTile } from "./recoil/tiles";
import { playersList } from "./recoil/players";
import { tilesInGrid } from "./recoil/grid";
import { gameState } from "./recoil/game";
import { churchesList, citiesList, fieldsList, roadsList, updatesAfterResolvingCollisions } from "./recoil/mapObjects";
import {
    collectNewObjectsFromTile,
    collectCollisionsFromTile,
    getTilesWithResolvedCollisions,
    getMapObjBySide,
    isFinished,
    determinePlayersToGetScores,
    isChurchFinished,
} from "./utils"
import {
    ROAD,
    CITY,
    FIELD,
    CHURCH,
    FINAL_SCORE_CALCULATION,
    FINISHED,
} from "./constants";

export default function GameLoop() {

    const [objectsAdded, setObjectsAdded] = useState(false);

    const lastTile = useRecoilValue(lastPlacedTile);
    const [gridTiles, setTilesInGrid] = useRecoilState(tilesInGrid);
    const [updatesAfterCollisions, setUpdatesAfterCollisions] = useRecoilState(updatesAfterResolvingCollisions);
    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const [roads, setRoads] = useRecoilState(roadsList);
    const [fields, setFields] = useRecoilState(fieldsList);
    const [cities, setCities] = useRecoilState(citiesList);
    const [churches, setChurches] = useRecoilState(churchesList);
    const [players, setPlayers] = useRecoilState(playersList);

    useEffect(() => {
        if (lastTile) {
            // resolve collisions once the new tile is placed
            resolveCollisions(lastTile);
            // Update map objects after the tile is placed
            updateMapObjects(lastTile);
            setObjectsAdded(true);
        }
    }, [lastTile])

    const resolveCollisions = function (lastTile) {
        const collisions = collectCollisionsFromTile(lastTile.tile, lastTile.coords, gridTiles);
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
                    tileCoords: [...newMapObj.tileCoords, ...oldMapObj.tileCoords],
                    players: { ...newMapObj.players },
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

    const resolveCollisionsInTheGridTiles = function (collisions) {
        setTilesInGrid(produce(tiles => {
            getTilesWithResolvedCollisions(collisions.roads, tiles);
            getTilesWithResolvedCollisions(collisions.cities, tiles);
            getTilesWithResolvedCollisions(collisions.fields, tiles);
        }))
    }

    const updateMapObjects = function (tile) {
        const objects = collectNewObjectsFromTile(tile.tile);
        updateObjects(objects.newRoads, setRoads, ROAD, tile.coords);
        updateObjects(objects.newCities, setCities, CITY, tile.coords);
        updateObjects(objects.newFields, setFields, FIELD, tile.coords);
        updateObjects(objects.newChurches, setChurches, CHURCH, tile.coords);
    }

    const updateObjects = function (newObjects, setter, type, coords) {
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

    // check finished map objects after the tile is placed
    useEffect(() => {
        if (objectsAdded) {
            handleAssetsFinish(lastTile.tile);
            setObjectsAdded(false);
            console.log('before placing meeple')
            console.log('roads', roads);
            console.log('cities', cities);
            console.log('fields', fields);
            console.log('churches', churches);
        }
    }, [objectsAdded])

    const handleAssetsFinish = function (tile) {
        // find the finished assets
        const finishedMapObjects = { roads: [], cities: [], fields: [], churches: [] };
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
        // find the just finished churches
        setChurches(produce(churchesList => {
            churchesList.forEach(church => {
                if (isChurchFinished(church, gridTiles) && !church.finished) {
                    finishedMapObjects.churches.push(churches.find(ch => ch.id === church.id));
                    church.finished = true;
                }
            })
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
            finishedMapObjects.churches.forEach(church => {
                if (Object.keys(church.players).length != 0) {
                    Object.keys(church.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        player.meeples += church.players[id];
                        player.score += 9;
                    })
                }
            })
        }))
    }

    useEffect(() => {
        if (gameStatus === FINAL_SCORE_CALCULATION) {
            calculateFinalScore();
            setGameStatus(FINISHED);
        }
    }, [gameStatus])

    const calculateFinalScore = function () {
        setPlayers(produce(players => {
            roads.forEach(road => {
                if (!road.finished && Object.keys(road.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(road.players);
                    Object.keys(road.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) player.score += road.tileCoords.length;
                    })
                }
            });
            cities.forEach(city => {
                if (!city.finished && Object.keys(city.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(city.players);
                    Object.keys(city.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) player.score += city.tileCoords.length;
                    })
                }
            });
            churches.forEach(church => {
                if (!church.finished && Object.keys(church.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(church.players);
                    Object.keys(church.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) player.score += getScoreForChurch(church);
                    })
                }
            });
            // add score for fields
        }))
    }

    const getScoreForChurch = function(church) {
        const coords = church.tileCoords[0];
        let score = 1;
        if (gridTiles[`${coords[0] - 1}_${coords[1] - 1}`]) {
            score++;
        }
        if (gridTiles[`${coords[0] - 1}_${coords[1]}`]) {
            score++;
        }
        if (gridTiles[`${coords[0] - 1}_${coords[1] + 1}`]) {
            score++;
        }
        if (gridTiles[`${coords[0]}_${coords[1] - 1}`]) {
            score++;
        }
        if (gridTiles[`${coords[0]}_${coords[1] + 1}`]) {
            score++;
        }
        if (gridTiles[`${coords[0] + 1}_${coords[1] - 1}`]) {
            score++;
        }
        if (gridTiles[`${coords[0] + 1}_${coords[1]}`]) {
            score++;
        }
        if (gridTiles[`${coords[0] + 1}_${coords[1] + 1}`]) {
            score++;
        }
        return score;
    }

    return null;
}