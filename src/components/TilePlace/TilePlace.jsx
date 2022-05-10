import produce from "immer";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PLACE_MEEPLE, PLACE_TILE } from "../../constants";
import { gameState } from "../../recoil/game";
import { gridParams, tilesInGrid } from "../../recoil/grid";
import { nextTile, tileIndex } from "../../recoil/tiles";
import { playersList, activePlayer } from "../../recoil/players";
import PlaceMeepleZone from "./PlaceMeepleZone";
import MeepleOnTile from "./MeepleOnTile";
import { getTileWithIds } from "./utils"

import "./TilePlace.css"

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
    const [active, setActivePlayer] = useRecoilState(activePlayer);

    const [tileInPlace, setTileInPlace] = useState(null);
    const [valid, setValid] = useState(false);
    const [readyForMeeple, setReadyForMeeple] = useState(false);
    const [meeple, setMeeple] = useState(null);

    const placeTile = function () {
        if (tile && valid && !tileInPlace) {
            const tileToPlace = getTileWithIds(tile, coords, gridTiles);
            // resolve collisions
            // add new assets and update the existing ones
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
        }
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
        if (!Object.keys(gridTiles).length) {
            setValid(true);
            return;
        }
        if (gameStatus != PLACE_TILE || tileInPlace || !tile) {
            setValid(false);
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
            (!gridTiles[`${coords[0] - 1}_${coords[1]}`] || gridTiles[`${coords[0] - 1}_${coords[1]}`].bottom === tile.top) &&
            (!gridTiles[`${coords[0] + 1}_${coords[1]}`] || gridTiles[`${coords[0] + 1}_${coords[1]}`].top === tile.bottom) &&
            (!gridTiles[`${coords[0]}_${coords[1] - 1}`] || gridTiles[`${coords[0]}_${coords[1] - 1}`].right === tile.left) &&
            (!gridTiles[`${coords[0]}_${coords[1] + 1}`] || gridTiles[`${coords[0]}_${coords[1] + 1}`]?.left === tile.right)
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

    const handleZoneClick = function(side) {
        setMeeple({color: active.color, position: side});
        setPlayers(produce((players) => {players[active.indexInArray].meeples--}))
        // handle assets finish
        setActivePlayer(players[(active.indexInArray + 1) % players.length])
        setGameStatus(PLACE_TILE);
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
                <PlaceMeepleZone tileSize={size} onZoneClick={handleZoneClick}/>
            }
            {
                meeple &&
                <MeepleOnTile tileSize={size} color={meeple.color} position={meeple.position} />
            }
        </div>
    );
}