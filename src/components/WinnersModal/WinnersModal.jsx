import React, { useState } from "react";
import produce from "immer";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";

import { ADD_PLAYERS, PLACE_TILE, NEW_GAME, FINISHED } from "../../constants"
import { Dialog } from "@mui/material";
import { gameState } from "../../recoil/game";
import { activePlayer, playersList } from "../../recoil/players";
import { citiesList, fieldsList, roadsList, updatesAfterResolvingCollisions } from "../../recoil/mapObjects";
import { Button, DialogTitle } from "@mui/material";
import { gridParams, tilesInGrid } from "../../recoil/grid";
import { lastPlacedTile, tileIndex, tilesList } from "../../recoil/tiles";

import "./WinnersModal.css"

export default function WinnersModal() {

    const [gameStatus, setGameStatus] = useRecoilState(gameState);
    const players = useRecoilValue(playersList);
    const resetPlayers = useResetRecoilState(playersList);
    const resetActivePlayer = useResetRecoilState(activePlayer);
    const resetRoads = useResetRecoilState(roadsList);
    const resetFields = useResetRecoilState(fieldsList);
    const resetCities = useResetRecoilState(citiesList);
    const resetGrid = useResetRecoilState(gridParams);
    const resetUpdatesAfterResolvingCollisions = useResetRecoilState(updatesAfterResolvingCollisions);
    const resetGridTiles = useResetRecoilState(tilesInGrid);
    const resetTiles = useResetRecoilState(tilesList);
    const resetTileIndex = useResetRecoilState(tileIndex);
    const resetLastPlacedTile = useResetRecoilState(lastPlacedTile);

    const startNewGame = function () {
        setGameStatus(NEW_GAME);
        resetPlayers();
        resetActivePlayer();
        resetCities();
        resetFields();
        resetRoads();
        resetUpdatesAfterResolvingCollisions();
        resetGrid();
        resetGridTiles();
        resetTiles();
        resetTileIndex();
        resetLastPlacedTile();
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