import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { ADD_PLAYERS, NEW_GAME, FINISHED } from "../../constants"
import { Dialog } from "@mui/material";
import { gameState } from "../../recoil/game";
import { playersList } from "../../recoil/players";
import { Button, DialogTitle } from "@mui/material";

import "./WinnersModal.css"

export default function WinnersModal() {

    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const players = useRecoilValue(playersList);

    const handleClose = function () {
        setGameStatus(NEW_GAME);
    }

    const startNewGame = function () {
        setGameStatus(ADD_PLAYERS);
    }

    const determineWinners = function () {
        let winners = [];
        let maxScore = 0;
        for (let player of players) {
            if (player.score > maxScore) {
                winners = [player];
                maxScore = player.score;
            } else if (player.score === maxScore) {
                winners.push(player);
            }
        }
        return winners;
    }

    return (
        <Dialog
            open={gameStatus === FINISHED}
            onClose={handleClose}
        >
            <DialogTitle>The winner(s):</DialogTitle>
            <div className="winner-info">
                    <div>Name</div>
                    <div>Score</div>
                </div>
            {determineWinners().map(winner =>
                <div className="winner-info" key={winner.name}>
                    <div>{winner.name}</div>
                    <div>{winner.score}</div>
                </div>
            )}
            <Button variant="contained" onClick={startNewGame}>Start new game</Button>
        </Dialog>
    )
}