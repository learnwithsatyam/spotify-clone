// this atom will keep track of what items are being played
import { atom } from "recoil";

export const CurrentTrackIdState = atom({
    key: "currentTrackState",
    default: null
})

export const isPlayingState = atom({
    key: "isPlayingState",
    default : false
})

export const isPlayError = atom({
    key: "isPlayError",
    default: false
})