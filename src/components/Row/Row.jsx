import React from "react";

import TilePlace from "../TilePlace/TilePlace"

import "./Row.css"

export default function Row({
    tilesCount,
    tileSize,
    rowNum
}) {
    let columns = Array.from(new Array(tilesCount).keys());
    
    return (
        <div className="row-container">
            {columns.map((i) => {
                return <TilePlace text={rowNum * tilesCount + i + 1} size={tileSize} key={i}/>
            })}
        </div>
    )
}