import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import NextTile from './../NextTile/NextTile';
import PlayersSection from './../PlayersSection/PlayersSection'
import { gameState } from "../../recoil/game";
import { ADD_PLAYERS, NEW_GAME } from "../../constants"

import "./Controls.css"

export default function Controls() {
    const [gameStatus, setGameStatus] = useRecoilState(gameState);

    const startNewGame = function () {
        setGameStatus(ADD_PLAYERS);
    }

    return (
        <div className="controls-panel">
            {[NEW_GAME, ADD_PLAYERS].includes(gameStatus) ?
                <div className="new-game-btn-container">
                    <div className="new-game-btn" onClick={startNewGame}>
                        Start New Game
                    </div>
                </div>
                :
                <>
                    <PlayersSection />
                    <NextTile />
                </>
            }
        </div>
    )
}