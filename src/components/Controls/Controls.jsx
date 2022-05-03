import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import NextTile from './../NextTile/NextTile';
import PlayersSection from './../PlayersSection/PlayersSection'
import { gameState } from "../../recoil/game";
import { activePlayer, playersList } from "../../recoil/players";
import { ADD_PLAYERS, NEW_GAME, PLACE_TILE, PLACE_MEEPLE, FINISHED } from "../../constants"

import "./Controls.css"
import { Button } from "@mui/material";

export default function Controls() {
    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const players = useRecoilValue(playersList);
    const [active, setActivePlayer] = useRecoilState(activePlayer)

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
                <PlayersSection />
            }
            {gameStatus === PLACE_MEEPLE &&
                <Button
                    variant="outlined"
                    onClick={() => {
                        setActivePlayer(players[(active.indexInArray + 1) % players.length])
                        setGameStatus(PLACE_TILE);
                    }}
                >
                    Next player
                </Button>
            }
            {[PLACE_TILE, FINISHED].includes(gameStatus) && <NextTile />}
        </div>
    )
}