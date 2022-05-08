import React from "react";

import "./TilePlace.css"

export default function PlaceMeepleZone({
    tileSize,
    onZoneClick
}) {

    const zoneSize = tileSize / 3;

    const getZone = function(top, left, side) {
        return (
            <div
                style={{
                    width: zoneSize,
                    height: zoneSize,
                    position: "absolute",
                    top: top,
                    left: left
                }}
                onClick={() => onZoneClick(side)}
            />
        )
    }

    return (
        <div
            className="place-meeple-zones"
            style={{ width: tileSize, height: tileSize, marginTop: -1 * tileSize }}
        >
            {getZone(0, zoneSize, 'top')}
            {getZone(zoneSize, 0, 'left')}
            {getZone(2 * zoneSize, zoneSize, 'bottom')}
            {getZone(zoneSize, 2 * zoneSize, 'right')}
        </div>
    )
}