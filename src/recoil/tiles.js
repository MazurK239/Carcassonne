import { atom, DefaultValue, selector } from "recoil";
import Tile from "../tiles/Tile";
import drawTiles from "../tiles/tilesList"

export const nextTile = atom({
    key: "nextTile",
    default: Tile.initialTile()
});

const indexInArray = atom({
    key: "indexInArray",
    default: -1,
})

export const tilesList = atom({
    key: "tilesList",
    default: drawTiles(),
});

export const lastPlacedTile = atom({
    key: "lastPlacedTile",
    default: null,
})

export const tileIndex = selector({
    key: "tileIndex",
    get: ({ get }) => get(indexInArray),
    set: ({ set, get }, newValue) => {
        set(indexInArray, newValue);
        if (newValue instanceof DefaultValue) {
            set(nextTile, Tile.initialTile());
        } else {
            const list = get(tilesList);
            set(nextTile, newValue < list.length ? list[newValue] : null);
        }
    }
})