import { atom } from "recoil";

export const playersList = atom({
    key: "playersList",
    default: []
})

export const activePlayer = atom({
    key: "activePlayer",
    default: null
})