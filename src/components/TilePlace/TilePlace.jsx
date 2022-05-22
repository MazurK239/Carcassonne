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
    getTilesWithResolvedCollisions
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
            // handle assets finish
            setGameStatus(PLACE_MEEPLE);
            setReadyForMeeple(true);
            console.log('roads', roads);
            console.log('cities', cities);
            console.log('fields', fields);
        }
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
        updateObjects(objects.newRoads, setRoads);
        updateObjects(objects.newCities, setCities);
        updateObjects(objects.newFields, setFields);
    }

    const updateObjects = function (newObjects, setter) {
        setter(produce(objects => {
            newObjects.forEach(id => {
                if (objects.find(obj => obj.id === id)) {
                    const obj = objects.find(obj => obj.id === id);
                    obj.tileCoords.push(coords);
                } else {
                    objects.push({ id, tileCoords: [coords], player: null, finished: false });
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

    useEffect(() => {
        if (gameStatus === PLACE_TILE) {
            setReadyForMeeple(false);
        }
    }, [gameStatus])

    const handleZoneClick = function (side) {
        setMeeple({ color: player.color, position: side });
        setPlayers(produce((players) => { players[player.indexInArray].meeples-- }));
        addPlayerToMapObject(side);
        // handle assets finish
        setActivePlayer(players[(player.indexInArray + 1) % players.length]);
        setGameStatus(PLACE_TILE);
    }

    const addPlayerToMapObject = function (side) {
        if (tileInPlace[side].type === ROAD) {
            setRoads(produce((roads) => {
                roads.find(road => road.id == tileInPlace[side].id).player = player.id;
            }))
        } else if (tileInPlace[side].type === CITY) {
            setCities(produce((cities) => {
                cities.find(city => city.id == tileInPlace[side].id).player = player.id;
            }))
        } else if (tileInPlace[side].type === FIELD) {
            setFields(produce((fields) => {
                fields.find(field => field.id == tileInPlace[side].id).player = player.id;
            }))
        }
    }

    const canPlaceMeeple = function (side) {
        if (players[player.indexInArray].meeples === 0) return false;
        if (side.type === ROAD) {
            const road = roads.find(road => road.id == side.id);
            return road.player === null || road.player === player.id;
        } else if (side.type === CITY) {
            const city = cities.find(city => city.id == side.id);
            return city.player === null || city.player === player.id;
        } else if (side.type === FIELD) {
            const field = fields.find(field => field.id == side.id);
            return field.player === null || field.player === player.id;
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