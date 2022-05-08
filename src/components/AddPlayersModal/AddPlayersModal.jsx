import React, { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { ADD_PLAYERS, PLACE_TILE, NEW_GAME } from "../../constants"
import { Dialog } from "@mui/material";
import { gameState } from "../../recoil/game";
import { activePlayer, playersList } from "../../recoil/players";
import { Button, DialogTitle } from "@mui/material";
import PlayerInfo from "./PlayerInfo"
import AddPlayerSection from "./AddPlayerSection"

import "./AddPlayersModal.css"
import produce from "immer";

export default function AddPlayersModal() {
    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const [players, setPlayers] = useRecoilState(playersList);
    const setActivePlayer = useSetRecoilState(activePlayer);
    const [addingPlayer, setAddingPlayer] = useState(false);

    const handleClose = function () {
        setGameStatus(NEW_GAME);
        setPlayers([]);
    }

    const startGame = function () {
        if (players.length) {
            setGameStatus(PLACE_TILE);
            setActivePlayer(players[0]);
            console.log(players[0]);
        }
    }

    return (
        <Dialog
            open={gameStatus === ADD_PLAYERS}
            onClose={handleClose}
        >
            <DialogTitle>Add players (Up to 4)</DialogTitle>
            {players.length < 4 &&
                <Button onClick={() => setAddingPlayer(true)}>Add player</Button>
            }
            {addingPlayer &&
                <AddPlayerSection
                    onPlayerAdded={(player) => {
                        setPlayers([...players, { ...player, indexInArray: players.length }])
                        setAddingPlayer(false);
                    }} />}
            {players.map((player, index) => {
                return <PlayerInfo
                    key={index}
                    name={player.name}
                    color={player.color}
                    removePlayer={() => setPlayers(produce((players) => { players.splice(index, 1) }))}
                />
            })}
            <Button variant="contained" onClick={startGame}>Start game</Button>
        </Dialog>
    )
}
