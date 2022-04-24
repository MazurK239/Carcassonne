import React from "react";
import { useWindowSize } from "@react-hook/window-size";

import Row from "./Row/Row"
import TilePlace from "./TilePlace/TilePlace";

export default function Grid({
    rows: rowsCount,
    columns: colsCount,
    tileSize,
    topLeft,
}) {
    let rows = Array(rowsCount).fill().map((_, i) => i + topLeft[0]);

    return (
        <div className="grid-container">
            {rows.map((i) => {
                return <Row
                    key={i}
                    rowNum={i}
                    tilesCount={colsCount}
                    startIdx={topLeft[1]}
                    tileSize={tileSize}
                />
            })}
        </div>
    )

}