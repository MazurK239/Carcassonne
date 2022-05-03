import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { FINISHED } from "../../constants";
import { gameState } from "../../recoil/game";
import { gridParams } from "../../recoil/grid";
import Grid from "../Grid";

import "./Board.css"

export default function Board() {

    const grid = useRecoilValue(gridParams);
    const boardRef = useRef(null);
    const gameStatus = useRecoilValue(gameState);

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