import React, { useEffect, useState } from "react";
import produce from "immer";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { playersList, activePlayer } from "./recoil/players";
import { gridParams, tilesInGrid } from "./recoil/grid";
import { lastPlacedTile, tileIndex, tilesList } from "./recoil/tiles";
import { gameState } from "./recoil/game";
import {
    churchesList,
    citiesList,
    fieldsList,
    roadsList,
    updatesAfterResolvingCollisions,
    fieldsToCitiesMapping
} from "./recoil/mapObjects";
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
    ADD_PLAYERS,
} from "./constants";
import drawTiles from "./tiles/tilesList";

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
    const [fieldsToCities, setFieldsToCities] = useRecoilState(fieldsToCitiesMapping);
    const [players, setPlayers] = useRecoilState(playersList);

    const resetPlayers = useResetRecoilState(playersList);
    const resetActivePlayer = useResetRecoilState(activePlayer);
    const resetRoads = useResetRecoilState(roadsList);
    const resetFields = useResetRecoilState(fieldsList);
    const resetCities = useResetRecoilState(citiesList);
    const resetChurches = useResetRecoilState(churchesList);
    const resetGrid = useResetRecoilState(gridParams);
    const resetUpdatesAfterResolvingCollisions = useResetRecoilState(updatesAfterResolvingCollisions);
    const resetGridTiles = useResetRecoilState(tilesInGrid);
    const resetTiles = useSetRecoilState(tilesList);
    const resetTileIndex = useResetRecoilState(tileIndex);
    const resetLastPlacedTile = useResetRecoilState(lastPlacedTile);

    // reset everything once new game starts
    useEffect(() => {
        if (gameStatus === ADD_PLAYERS) {
            resetPlayers();
            resetActivePlayer();
            resetCities();
            resetChurches();
            resetFields();
            resetRoads();
            resetUpdatesAfterResolvingCollisions();
            resetGrid();
            resetGridTiles();
            resetTiles(drawTiles());
            resetTileIndex();
            resetLastPlacedTile();
        }
    }, [gameStatus])

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
        resolveCollisionsInTheFieldsToCitiesMapping(collisions);
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
                // remove it from the list of objects
                objectsToReturn = objects.filter(obj => (obj.id != oldId) && (obj.id != newObjects[oldId]));
                // add the new object with the updated coordinates and players
                const tempObj =
                {
                    ...newMapObj,
                    tileCoords: [...newMapObj.tileCoords, ...oldMapObj.tileCoords],
                    players: { ...newMapObj.players },
                }
                if (oldMapObj.shields) {
                    tempObj.shields = (tempObj.shields ?? 0) + oldMapObj.shields;
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

    const resolveCollisionsInTheFieldsToCitiesMapping = function (collisions) {
        setFieldsToCities(produce(fieldsToCities => {
            // change ids of cities
            Object.keys(collisions.cities).forEach(oldCityId => {
                Object.values(fieldsToCities).forEach(citiesSet => {
                    if (citiesSet.has(oldCityId)) {
                        citiesSet.delete(oldCityId);
                        citiesSet.add(collisions.cities[oldCityId]);
                    }
                })
            })
            // change ids of fields
            Object.keys(collisions.fields).forEach(oldFieldId => {
                if (Object.keys(fieldsToCities).includes(oldFieldId)) {
                    fieldsToCities[collisions.fields[oldFieldId]] = new Set([
                        ...fieldsToCities[collisions.fields[oldFieldId]],
                        ...fieldsToCities[oldFieldId]
                    ]);
                    delete fieldsToCities[oldFieldId];
                }
            })
        }))
    }

    const updateMapObjects = function (tile) {
        const objects = collectNewObjectsFromTile(tile.tile);
        updateObjects(objects.newRoads, setRoads, ROAD, tile.coords);
        updateObjects(objects.newCities, setCities, CITY, tile.coords, tile.tile.hasShield);
        updateObjects(objects.newFields, setFields, FIELD, tile.coords);
        updateObjects(objects.newChurches, setChurches, CHURCH, tile.coords);
    }

    const updateObjects = function (newObjects, setter, type, coords, hasShield = false) {
        setter(produce(objects => {
            newObjects.forEach(id => {
                if (objects.find(obj => obj.id === id)) {
                    const obj = objects.find(obj => obj.id === id);
                    obj.tileCoords.push(coords);
                    if (hasShield) obj.shields = (obj.shields ?? 0) + 1;
                } else {
                    const newObj = { id, type, tileCoords: [coords], players: {}, finished: false };
                    if (hasShield) newObj.shields = 1;
                    objects.push(newObj);
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
            console.log('fieldsToCities', fieldsToCities);
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
                    const scoreBase = city.shields ? city.tileCoords.length + city.shields : city.tileCoords.length;
                    Object.keys(city.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        player.meeples += city.players[id];
                        if (winnerIds.includes(id)) player.score += scoreBase * 2;
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
                    const score = road.tileCoords.length;
                    Object.keys(road.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) {
                            player.score += score;
                            console.log('Score for road ' + road.id + ": " + score);
                        }
                    })
                }
            });
            cities.forEach(city => {
                if (!city.finished && Object.keys(city.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(city.players);
                    const score = city.shields ? city.tileCoords.length + city.shields : city.tileCoords.length;
                    Object.keys(city.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) {
                            player.score += score;
                            console.log('Score for city ' + city.id + ": " + score);
                        }
                    })
                }
            });
            churches.forEach(church => {
                if (!church.finished && Object.keys(church.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(church.players);
                    const score = getScoreForChurch(church);
                    Object.keys(church.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) {
                            player.score += score;
                            console.log('Score for church ' + church.id + ": " + score);
                        }
                    })
                }
            });
            // add score for fields
            fields.forEach(field => {
                if (Object.keys(field.players).length != 0) {
                    const winnerIds = determinePlayersToGetScores(field.players);
                    const score = getScoreForField(field);
                    Object.keys(field.players).forEach(id => {
                        const player = players.find(p => p.id === id);
                        if (winnerIds.includes(id)) {
                            player.score += score;
                            console.log('Score for field ' + field.id + ": " + score);
                        }
                    })
                }
            });
        }))
    }

    const getScoreForChurch = function (church) {
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

    const getScoreForField = function (field) {
        let score = 0;
        fieldsToCities[field.id]?.forEach(cityId => {
            if (cities.find(c => c.id === cityId)?.finished) {
                score += 3;
            }
        })
        return score;
    }

    return null;
}