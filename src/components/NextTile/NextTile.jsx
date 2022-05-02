import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import Tile from "../../tiles/Tile";
import { nextTile, tileIndex } from "../../recoil/tiles";
import "./NextTile.css"
import { ADD_PLAYERS, NEW_GAME, TILE_SIDE_PX } from "../../constants"
import { RotateLeft, RotateRight } from "@mui/icons-material";
import { gameState } from "../../recoil/game";

export default function NextTile() {

    const [tile, setNextTile] = useRecoilState(nextTile);
    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const tileIdx = useRecoilValue(tileIndex);
    const tileRef = useRef(null);

    const rotateClockwise = function () {
        const rotatedTile = Tile.rotateClockwise(tile);
        setNextTile(rotatedTile);
        tileRef.current.setAttribute("style", "transform: rotate(" + rotatedTile.rotationAngle + "deg)");
        console.log(rotatedTile);
    }

    const rotateCounterClockwise = function () {
        const rotatedTile = Tile.rotateCounterClockwise(tile);
        setNextTile(rotatedTile);
        tileRef.current.setAttribute("style", "transform: rotate(" + rotatedTile.rotationAngle + "deg)");
        console.log(rotatedTile);
    }

    const startNewGame = function() {
        setGameStatus(ADD_PLAYERS);
    }

    useEffect(() => {
        tileRef.current?.setAttribute("style", "transform: none");
    }, [tileIdx])

    return (
        <div className="container">
            {gameStatus === NEW_GAME ?
                <div className="new-game-btn" onClick={startNewGame}>
                    Start New Game
                </div>
                :
                <div className="tileSection">
                    <button onClick={rotateCounterClockwise}>
                        <RotateLeft />
                    </button>
                    <div className="nextTile" ref={tileRef} style={{ width: TILE_SIDE_PX, height: TILE_SIDE_PX }}>
                        {tile ? <img src={tile.image.src} /> : "No more tiles"}
                    </div>
                    <button onClick={rotateClockwise}>
                        <RotateRight />
                    </button>
                </div>
            }
        </div>
    );
}