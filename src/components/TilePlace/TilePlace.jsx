import produce from "immer";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { gridParams } from "../../recoil/grid";
import { nextTile, tileIndex } from "../../recoil/tiles";

import "./TilePlace.css"

export default function TilePlace({
    coords,
    size
}) {
    const [tileInPlace, setTileInPlace] = useState(null);
    const tile = useRecoilValue(nextTile);
    const [tileIdx, setTileIdx] = useRecoilState(tileIndex);
    const [grid, setGridParams] = useRecoilState(gridParams);

    const placeTile = function () {
        if (tile) {
            setTileInPlace(tile);
            setTileIdx(tileIdx + 1);
            addRows();
            addCols();
        }
    }

    const addRows = function () {
        if (coords[0] == grid.topLeftIdx[0]) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.topLeftIdx[0]--;
                    gridParams.rows++;
                })
            )
        } else if (coords[0] == grid.topLeftIdx[0] + grid.rows - 1) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.rows++;
                })
            )
        }
    }

    const addCols = function () {
        if (coords[1] == grid.topLeftIdx[1]) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.topLeftIdx[1]--;
                    gridParams.columns++;
                })
            )
        } else if (coords[1] == grid.topLeftIdx[1] + grid.columns - 1) {
            setGridParams(
                produce((gridParams) => {
                    gridParams.columns++;
                })
            )
        }
    }

    return (
        <div className="tile" onClick={placeTile} style={{ width: size, height: size, lineHeight: `${size}px` }}>
            {
                tileInPlace &&
                <img src={tileInPlace.image.src} style={{ width: size - 2, height: size - 2, transform: "rotate(" + tileInPlace.rotationAngle + "deg)" }} />
            }
        </div>
    );
}