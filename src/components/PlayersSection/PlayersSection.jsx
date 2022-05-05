import React from "react";
import { playersList, activePlayer } from "../../recoil/players";
import { useRecoilState, useRecoilValue } from "recoil";

import PlayerCard from "./PlayerCard";

import "./PlayersSection.css"

export default function PlayersSection() {

    const players = useRecoilValue(playersList);
    const active = useRecoilValue(activePlayer);

    return (
        <div className="players-section-container">
            <div className="players-section-container-inner">
                <PlayerCard player={players[0]} active={active.name === players[0].name} />
                {players[1] && <PlayerCard player={players[1]} active={active.name === players[1].name} />}
            </div>
            {players[2] &&
                <div className="players-section-container-inner">
                    <PlayerCard player={players[2]} active={active.name === players[2].name}/>
                    {players[3] && <PlayerCard player={players[3]} active={active.name === players[3].name}/>}
                </div>
            }
        </div>
    )
}