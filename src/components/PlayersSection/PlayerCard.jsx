import { Typography } from "@mui/material";
import React from "react";
import MeepleIcon from "../../icons/MeepleIcon";

import "./PlayersSection.css"

export default function PlayerCard({ player, active }) {

    let meeples = Array(player.meeples).fill().map((_, i) => i);

    return (
        <div className="player-card-container">
            <div style={{
                backgroundColor: active ? "cyan" : "white",
                width: "10px",
                height: "10px",
            }} />
            <div className="player-card-info">
                <Typography maxWidth={100}>{player.name}</Typography>
                <div className="meeples">
                    {meeples.map((i) =>
                        <div key={i} style={{ marginLeft: -10 }}>
                            <MeepleIcon color={player.color} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}