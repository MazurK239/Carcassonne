import { Button, Input, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { INITIAL_MEEPLES_COUNT } from "../../constants";

import "./AddPlayersModal.css"

export default function AddPlayerSection({ onPlayerAdded }) {

    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    return (
        <div className="add-player-container">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Select
                value={color}
                label="Color"
                onChange={(e) => setColor(e.target.value)}
            >
                <MenuItem value={"red"}>Red</MenuItem>
                <MenuItem value={"blue"}>Blue</MenuItem>
                <MenuItem value={"green"}>Green</MenuItem>
                <MenuItem value={"yellow"}>Yellow</MenuItem>
            </Select>
            <Button onClick={() => onPlayerAdded({ name, color, meeples: INITIAL_MEEPLES_COUNT })}>
                Add
            </Button>
        </div>
    )
}