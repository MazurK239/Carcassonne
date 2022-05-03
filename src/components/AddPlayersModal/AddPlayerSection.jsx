import { Button, Input, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { INITIAL_MEEPLES_COUNT } from "../../constants";
import { playersList } from "../../recoil/players";

import "./AddPlayersModal.css"

export default function AddPlayerSection({ onPlayerAdded }) {

    const [name, setName] = useState('');
    const [color, setColor] = useState('');
    const players = useRecoilValue(playersList);
    const availableColors = [
        { name: "Red", color: "red" },
        { name: "Blue", color: "blue" },
        { name: "Green", color: "green" },
        { name: "Yellow", color: "yellow" },
    ].filter((color) => !players.find((player) => player.color === color.color))

    return (
        <div className="add-player-container">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Select
                value={color}
                label="Color"
                onChange={(e) => setColor(e.target.value)}
            >
                {availableColors.map((color) => <MenuItem value={color.color}>{color.name}</MenuItem>)}
            </Select>
            <Button onClick={() => onPlayerAdded({ name, color, meeples: INITIAL_MEEPLES_COUNT })}>
                Add
            </Button>
        </div>
    )
}