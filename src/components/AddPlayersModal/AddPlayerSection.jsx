import { Button, Select, MenuItem, InputLabel, OutlinedInput, FormControl } from "@mui/material";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_MEEPLES_COUNT } from "../../constants";
import { playersList } from "../../recoil/players";

import "./AddPlayersModal.css"

export default function AddPlayerSection({ onPlayerAdded }) {

    const players = useRecoilValue(playersList);
    const availableColors = [
        { name: "Red", color: "red" },
        { name: "Blue", color: "blue" },
        { name: "Green", color: "green" },
        { name: "Yellow", color: "yellow" },
    ].filter((color) => !players.find((player) => player.color === color.color));
    const [name, setName] = useState('');
    const [color, setColor] = useState(availableColors[0].color);

    const addPlayer = function () {
        if (name != '') {
            onPlayerAdded({ id: uuidv4(), name, color, meeples: INITIAL_MEEPLES_COUNT, score: 0 })
        }
    }

    return (
        <div className="add-player-container">
            <OutlinedInput placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormControl>
                <InputLabel id="color-input-label">Color</InputLabel>
                <Select
                    labelId="color-input-label"
                    value={color}
                    label="Color"
                    onChange={(e) => setColor(e.target.value)}
                >
                    {availableColors.map((color) =>
                        <MenuItem key={color.color} value={color.color}>{color.name}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <Button onClick={addPlayer}>
                Add
            </Button>
        </div>
    )
}