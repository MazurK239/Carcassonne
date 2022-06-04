import React, { useEffect, useRef } from "react";
import produce from "immer";
import { useRecoilValue, useRecoilState } from "recoil";
import { FINISHED } from "../../constants";
import { gameState } from "../../recoil/game";
import { gridParams, tilesInGrid } from "../../recoil/grid";
import Grid from "../Grid";

import "./Board.css"

export default function Board() {

    const [grid, setGridParams] = useRecoilState(gridParams);
    const boardRef = useRef(null);
    const gameStatus = useRecoilValue(gameState);
    const gridTiles = useRecoilValue(tilesInGrid);

    useEffect(() => {
        if (grid.columns * grid.tileSize < boardRef.current.offsetWidth) {
            boardRef.current.classList.add("board-flex-vertical-align");
        } else {
            boardRef.current.classList.remove("board-flex-vertical-align");
        }
        if (grid.rows * grid.tileSize < boardRef.current.offsetHeight) {
            boardRef.current.classList.add("board-flex-horizontal-align");
        } else {
            boardRef.current.classList.remove("board-flex-horizontal-align");
        }
    });

    // add rows and columns to grid after the tile has been placed
    useEffect(() => {
        if (!Object.keys(gridTiles).length) return;
        let left = grid.topLeftIdx[1];
        let right = grid.topLeftIdx[1] + grid.columns - 1;
        let top = grid.topLeftIdx[0];
        let bottom = grid.topLeftIdx[0] + grid.rows - 1;
        let rows = grid.rows;
        let columns = grid.columns;
        let coords;
        let updated = false;
        for (let tileIdx in gridTiles) {
            coords = tileIdx.split("_");
            if (coords[0] == top) {
                top--; rows++; updated = true;
            } else if (coords[0] == bottom) {
                bottom++; rows++; updated = true;
            }
            if (coords[1] == left) {
                left--; columns++; updated = true;
            } else if (coords[1] == right) {
                right++; columns++; updated = true;
            }
            if (updated) break;
        }
        setGridParams(
            produce((gridParams) => {
                gridParams.topLeftIdx = [top, left];
                gridParams.rows = rows;
                gridParams.columns = columns;
            })
        )
    }, [gridTiles])

    useEffect(() => {
        // if (gameStatus === FINISHED) alert("The game is finished!")
    }, [gameStatus])

    return (
        <div className="board" ref={boardRef}>
            <Grid
                rows={grid.rows}
                columns={grid.columns}
                topLeft={grid.topLeftIdx}
                tileSize={grid.tileSize}
            />
        </div>
    )
}