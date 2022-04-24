import produce from "immer";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { gridParams, tilesInGrid } from "../../recoil/grid";
import { nextTile, tileIndex } from "../../recoil/tiles";

import "./TilePlace.css"

export default function TilePlace({
    coords,
    size
}) {
    const tile = useRecoilValue(nextTile);
    const [tileIdx, setTileIdx] = useRecoilState(tileIndex);
    const [grid, setGridParams] = useRecoilState(gridParams);
    const [gridTiles, setTilesInGrid] = useRecoilState(tilesInGrid);
    const [tileInPlace, setTileInPlace] = useState(null);
    const [valid, setValid] = useState(false);

    const placeTile = function () {
        if (tile && valid && !tileInPlace) {
            setTileInPlace(tile);
            setTileIdx(tileIdx + 1);
            setTilesInGrid(
                produce((tiles) => {
                    tiles[`${coords[0]}_${coords[1]}`] = tile;
                })
            )
            addRows();
            addCols();
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
        if (tileInPlace || !tile) {
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
    }, [tile])

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
        </div>
    );
}