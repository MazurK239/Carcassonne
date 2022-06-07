import React from "react";

import "./TilePlace.css"
import MeepleIcon from "../../icons/MeepleIcon"

export default function MeepleOnTile({
    tileSize,
    color,
    position
}) {

    const zoneSize = tileSize / 3;
    let top, left;
    switch (position) {
        case 'top':
            top = 0; left = zoneSize;
            break;
        case 'left':
            top = zoneSize; left = 0;
            break;
        case 'bottom':
            top = 2 * zoneSize; left = zoneSize;
            break;
        case 'right':
            top = zoneSize; left = 2 * zoneSize;
            break;
        case 'center':
            top = zoneSize; left = zoneSize;
            break;

    }

    return (
        <div
            className="meeple-on-tile"
            style={{ width: tileSize, height: tileSize, marginTop: -1 * tileSize }}
        >
            <div
                className="meeple-on-tile"
                style={{
                    width: zoneSize,
                    height: zoneSize,
                    position: "absolute",
                    top: top,
                    left: left
                }}
            >
                <MeepleIcon color={color} width={zoneSize} height={zoneSize} />
            </div>
        </div>
    )
}