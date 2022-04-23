import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { nextTile, tileIndex } from "../../recoil/tiles";

import "./TilePlace.css"

export default function TilePlace({
    text,
    size
}) {
    const [tileInPlace, setTileInPlace] = useState(null);
    const tile = useRecoilValue(nextTile);
    const [tileIdx, setTileIdx] = useRecoilState(tileIndex);

    const placeTile = function () {
        setTileInPlace(tile);
        setTileIdx(tileIdx + 1);
    }

    return (
        <div className="tile" onClick={placeTile} style={{ width: size, height: size, lineHeight: `${size}px` }}>
            {
                tileInPlace ?
                    <img src={tileInPlace.image.src} style={{ width: size - 2, height: size - 2, transform: "rotate(" + tileInPlace.rotationAngle + "deg)" }} /> :
                    text
            }
        </div>
    );
}