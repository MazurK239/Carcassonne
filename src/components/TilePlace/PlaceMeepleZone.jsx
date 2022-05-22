import React from "react";

import "./TilePlace.css"

export default function PlaceMeepleZone({
    tileSize,
    onZoneClick,
    showSide,
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
            {showSide.top && getZone(0, zoneSize, 'top')}
            {showSide.left && getZone(zoneSize, 0, 'left')}
            {showSide.bottom && getZone(2 * zoneSize, zoneSize, 'bottom')}
            {showSide.right && getZone(zoneSize, 2 * zoneSize, 'right')}
        </div>
    )
}