import { atom } from "recoil";

export const roadsList = atom({
    key: "roadsList",
    default: [],
})

export const citiesList = atom({
    key: "citiesList",
    default: [],
})

export const fieldsList = atom({
    key: "fieldsList",
    default: [],
})

export const churchesList = atom({
    key: "churchesList",
    default: [],
})

export const updatesAfterResolvingCollisions = atom({
    key: "updatesAfterResolvingCollisions",
    default: {},
})

export const fieldsToCitiesMapping = atom({
    key: "fieldsToCitiesMapping",
    default: {},
})