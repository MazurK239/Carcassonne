import React from "react";
import { useWindowSize } from "@react-hook/window-size";

import Row from "./Row/Row"

export default function Grid({
    tilesInRow
}) {
    const [width, height] = useWindowSize()
    const tileSize = Number.parseInt(width / (tilesInRow + 2));
    const tilesInCol = Number.parseInt(height / tileSize);
    let rows = Array.from(new Array(tilesInCol).keys());

    return (
        <div className="grid-container" style={{margin: `0px ${tileSize}px`}}>
            {rows.map((i) => {
                return <Row key={i} rowNum={i} tilesCount={tilesInRow} tileSize={tileSize}/>
            })}
        </div>
    )
    
}