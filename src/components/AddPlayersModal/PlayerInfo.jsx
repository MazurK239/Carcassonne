import React from "react";

import "./AddPlayersModal.css"

export default function PlayerInfo({name, color}) {
    return (
        <div className="player-info" style={{backgroundColor: color}}>
            {name}
        </div>
    )
}