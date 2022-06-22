import produce from "immer";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    PLACE_MEEPLE,
    PLACE_TILE,
    ROAD,
    CITY,
    FIELD,
    CHURCH,
    NEW_GAME
} from "../../constants";
import { gameState } from "../../recoil/game";
import { tilesInGrid } from "../../recoil/grid";
import { nextTile, tileIndex, lastPlacedTile } from "../../recoil/tiles";
import { playersList, activePlayer } from "../../recoil/players";
import PlaceMeepleZone from "./PlaceMeepleZone";
import MeepleOnTile from "./MeepleOnTile";
import {
    getTileWithIds,
} from "../../utils"

import "./TilePlace.css"
import {
    churchesList,
    citiesList,
    fieldsList,
    roadsList,
    updatesAfterResolvingCollisions,
    fieldsToCitiesMapping
} from "../../recoil/mapObjects";

export default function TilePlace({
    coords,
    size
}) {
    const tile = useRecoilValue(nextTile);
    const [tileIdx, setTileIdx] = useRecoilState(tileIndex);
    const setLastPlacedTile = useSetRecoilState(lastPlacedTile);
    const [gridTiles, setTilesInGrid] = useRecoilState(tilesInGrid);
    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const [players, setPlayers] = useRecoilState(playersList);
    const [player, setActivePlayer] = useRecoilState(activePlayer);
    const updatesAfterCollisions = useRecoilValue(updatesAfterResolvingCollisions);

    const [roads, setRoads] = useRecoilState(roadsList);
    const [fields, setFields] = useRecoilState(fieldsList);
    const [cities, setCities] = useRecoilState(citiesList);
    const [churches, setChurches] = useRecoilState(churchesList);
    const setFieldsToCities = useSetRecoilState(fieldsToCitiesMapping);

    const [tileInPlace, setTileInPlace] = useState(null);
    const [valid, setValid] = useState(false);
    const [readyForMeeple, setReadyForMeeple] = useState(false);
    const [meeple, setMeeple] = useState(null);

    const placeTile = function () {
        if (tile && valid && !tileInPlace) {
            const tileToPlace = getTileWithIds(tile, coords, gridTiles);
            collectFieldsToCitiesMapping(tileToPlace);
            setTileInPlace(tileToPlace);
            setTilesInGrid(
                produce((tiles) => {
                    tiles[`${coords[0]}_${coords[1]}`] = tileToPlace;
                })
            )
            setLastPlacedTile({ tile: tileToPlace, coords });
        }
    }

    const collectFieldsToCitiesMapping = function (tile) {
        setFieldsToCities(produce(fieldsToCities => {
            Object.values(tile.getSides()).forEach(obj => {
                if (obj.type === CITY) {
                    obj.surroundingFields.forEach(fieldId => {
                        if (fieldsToCities[fieldId]) {
                            fieldsToCities[fieldId].push(obj.id);
                        } else {
                            fieldsToCities[fieldId] = [obj.id];
                        }
                    })
                }
            })
        }))
    }

    // finish map objects and get ready to place meeple
    useEffect(() => {
        if (tileInPlace) {
            setGameStatus(PLACE_MEEPLE);
            setReadyForMeeple(true);
        }
    }, [tileInPlace])

    // change ids on the placed meeples after the collisions are resolved
    useEffect(() => {
        if (meeple && updatesAfterCollisions[meeple.objectId]) {
            setMeeple({ ...meeple, objectId: updatesAfterCollisions[meeple.objectId] });
        }
    }, [updatesAfterCollisions])

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

    // reset the tiles when the new game is ready to begin
    useEffect(() => {
        if (gameStatus === NEW_GAME) {
            setTileInPlace(null);
            setMeeple(null);
        }
    }, [gameStatus])

    // delete meeple from tile if it is on the finished object
    useEffect(() => {
        if (meeple) {
            [roads, cities, churches].forEach(objList =>
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
    }, [roads, cities, fields, churches]);

    const handleZoneClick = function (side) {
        setMeeple({ color: player.color, position: side, objectId: tileInPlace[side].id });
        addPlayerToMapObject(side);
        setActivePlayer(players[(player.indexInArray + 1) % players.length]);
        setGameStatus(PLACE_TILE);
        setTileIdx(tileIdx + 1);
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
        } else if (tileInPlace[side].type === CHURCH) {
            setChurches(produce((churches) => {
                const church = churches.find(c => c.id == tileInPlace[side].id);
                church.players[player.id] = 1;
                if (church.finished) {
                    returnMeeple = true;
                    scoreToAdd = 9;
                }
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
                        center: tileInPlace.hasChurch,
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