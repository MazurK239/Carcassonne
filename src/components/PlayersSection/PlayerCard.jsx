import { Typography } from "@mui/material";
import React from "react";
import { useRecoilValue } from "recoil";
import { activePlayer } from "../../recoil/players";

import "./PlayersSection.css"

export default function PlayerCard({ player }) {

    const active = useRecoilValue(activePlayer);

    return (
        <div className="player-card-container">
            <div style={{
                backgroundColor: active.name === player.name ? "cyan" : "white",
                width: "10px",
                height: "10px",
            }} />
            <Typography maxWidth={100}>{player.name}</Typography>
            <Typography>{player.color}</Typography>
            <Typography>{player.meeples}</Typography>
        </div>
    )
}