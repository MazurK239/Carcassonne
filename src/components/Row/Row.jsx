import React from "react";

import TilePlace from "../TilePlace/TilePlace"

import "./Row.css"

export default function Row({
    tilesCount,
    tileSize,
    rowNum,
    startIdx
}) {
    let columns = Array(tilesCount).fill().map((_, i) => i + startIdx);;
    
    return (
        <div className="row-container">
            {columns.map((i) => {
                return <TilePlace coords={[rowNum, i]} size={tileSize} key={i}/>
            })}
        </div>
    )
}