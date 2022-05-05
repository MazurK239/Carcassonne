import React from "react";
import ClearIcon from '@mui/icons-material/Clear';

import "./AddPlayersModal.css"

export default function PlayerInfo({ name, color, removePlayer }) {
    return (
        <div className="player-info" style={{ backgroundColor: color }}>
            <div className="player-info-name">
                {name}
            </div>
            <div className="delete-player-icon" onClick={removePlayer}>
                <ClearIcon />
            </div>
        </div>
    )
}