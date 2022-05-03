import React from "react";
import { playersList } from "../../recoil/players";
import { useRecoilState, useRecoilValue } from "recoil";

import PlayerCard from "./PlayerCard";

import "./PlayersSection.css"

export default function PlayersSection() {

    const players = useRecoilValue(playersList);

    return (
        <div className="players-section-container">
            <div className="players-section-container-inner">
                <PlayerCard player={players[0]} />
                {players[1] && <PlayerCard player={players[1]} />}
            </div>
            {players[2] &&
                <div className="players-section-container-inner">
                    <PlayerCard player={players[2]} />
                    {players[3] && <PlayerCard player={players[3]} />}
                </div>
            }
        </div>
    )
}