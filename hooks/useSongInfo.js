import { useRecoilState } from "recoil"
import { CurrentTrackIdState } from "../atom/songAtom"
import useSpotify from "./useSpotify"
import { useState, useEffect } from "react"

function useSongInfo() {
    const spotifyApi = useSpotify()
    const [currentIdTrack, setCurrentTrack] = useRecoilState(CurrentTrackIdState)
    const [songInfo, setSongInfo] = useState(null)
    useEffect(async() => {
        const fetchSongInfo = async ()=>{
            if(currentIdTrack){
                const trackInfo = await fetch(  `https://api.spotify.com/v1/tracks/${currentIdTrack}` ,
                {   
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                    }
                }
                ).then(response => response.json())

                setSongInfo(trackInfo)
            }
        }
        fetchSongInfo();
    }, [currentIdTrack, spotifyApi])
    return (
        songInfo
    )
}

export default useSongInfo
