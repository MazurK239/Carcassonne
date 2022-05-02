import { atom } from "recoil";
import { NEW_GAME } from "../constants";

export const gameState = atom({
    key: "gameState",
    default: NEW_GAME,
})