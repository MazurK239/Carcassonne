import { atom } from "recoil";

export const gridParams = atom({
    key: "gridParams",
    default: {
        rows: 3,
        columns: 3,
        topLeftIdx: [0, 0],
        tileSize: 120,
    }
})

export const tilesInGrid = atom({
    key: "tilesInGrid",
    default: {},
})