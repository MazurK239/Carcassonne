import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import Tile from "../../tiles/Tile";
import { nextTile, tileIndex } from "../../recoil/tiles";
import "./NextTile.css"
import { TILE_SIDE_PX } from "../../constants"
import { RotateLeft, RotateRight } from "@mui/icons-material";

export default function NextTile() {

    const [tile, setNextTile] = useRecoilState(nextTile);
    const tileIdx = useRecoilValue(tileIndex);
    const tileRef = useRef(null);

    const rotateClockwise = function () {
        const rotatedTile = Tile.rotateClockwise(tile);
        setNextTile(rotatedTile);
        tileRef.current.setAttribute("style", "transform: rotate(" + rotatedTile.rotationAngle + "deg)");
    }

    const rotateCounterClockwise = function () {
        const rotatedTile = Tile.rotateCounterClockwise(tile);
        setNextTile(rotatedTile);
        tileRef.current.setAttribute("style", "transform: rotate(" + rotatedTile.rotationAngle + "deg)");
    }

    useEffect(() => {
        tileRef.current.setAttribute("style", "transform: none");
    }, [tileIdx])

    return (
        <div className="container">
            <div className="tileSection">
                <button onClick={rotateCounterClockwise}>
                    <RotateLeft />
                </button>
                <div className="nextTile" ref={tileRef} style={{ width: TILE_SIDE_PX, height: TILE_SIDE_PX }}>
                    {tile ? <img src={tile.image.src} /> : "No more tiles"}
                </div>
                <button onClick={rotateClockwise}>
                    <RotateRight />
                </button>
            </div>
        </div>
    );
}