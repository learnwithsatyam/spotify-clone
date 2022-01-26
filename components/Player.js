import useSpotify from "../hooks/useSpotify"
import { useSession } from "next-auth/react"
import { useCallback } from "react"
import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { CurrentTrackIdState, isPlayingState, isPlayError } from "../atom/songAtom"
import useSongInfo from "../hooks/useSongInfo"
import { SwitchHorizontalIcon } from "@heroicons/react/outline"
import { RewindIcon } from "@heroicons/react/solid"
import  {Heart, VolumeUpIcon  as VolumeDownIcon } from "@heroicons/react/outline"
import {
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    VolumeUpIcon
} from "@heroicons/react/solid"
import { debounce } from "lodash"
function Player() {
    const spotifyApi = useSpotify()
    const {data: session , status} = useSession()
    const [currentTrackId, setCurrentIdTrack] =  useRecoilState(CurrentTrackIdState)
    const [isPlaying , setIsPlaying] = useRecoilState(isPlayingState)
    const [volume , setVolume] = useState(50)
    const [isPlayErrorOccur, setIsPlayErrorOccur] = useRecoilState(isPlayError)


    const songInfo = useSongInfo()
    const fetchCurrentSong = ()=>{
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack()
            .then((data)=>{
                console.log("now playing : ",data.body?.item )
                setCurrentIdTrack(data.body?.item?.id)
                spotifyApi.getMyCurrentPlaybackState().then((data)=>{
                    setIsPlaying(data.body?.is_playing)
                }).catch((err)=> console.log('not able to fetch current playback state'))
            })
        }
    }
    const handlePlayPause= ()=>{
        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
           if(data?.body?.is_playing){
               spotifyApi.pause().catch((err)=>{
                   if(err.name === "WebapiPlayerError"){
                    setIsPlayErrorOccur(true)
                   }
                })
               setIsPlaying(false)
           }else{
               spotifyApi.play().catch((err)=>{
                if(err.name === "WebapiPlayerError"){
                    console.log('yeah the else works')
                 setIsPlayErrorOccur(true)
                }
             })
               setIsPlaying(true)
           }
        })
    }
    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong()
            setVolume(50)
        }
    }, [CurrentTrackIdState ,spotifyApi, session])

    useEffect(() => {
        debounceAdjustVolume(volume)
    }, [volume > 0 && volume < 100])

    const debounceAdjustVolume = useCallback(
        debounce((volume)=>{
            spotifyApi.setVolume(volume).catch((err)=>{setIsPlayErrorOccur(true)})
        }, 300),
        []
    )
    if(isPlayErrorOccur) return ( 
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white
        grid grid-cols-1 text-xs md:text-base px-2 md:px-8">
            <h1 className="flex flex-grow my-auto mx-auto text-sm">
                <b className="text-red-400">
                    ATTENTION: &nbsp;
                </b>
                You are not a premium user of spotify. You need a PREMIUM SUBSCRIPTION PLAN of spotify to use this website.
            </h1>
            <p> Also you need an active running connection to Spotify on any device ( phone , laptop , etc) to use this website because Spotify's Api puts some restricts on the developers. This website works as a remote control to the already running spotify connection on other device.</p>
        </div>
         )
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white
        grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            { isPlayErrorOccur?(
                        <h1>You are not a premium person</h1>
                    ):""
                }
            {/* left */}
            <div className="flex items-center space-x-4">
                <img className = "hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                    <h3>
                        {songInfo?.name}
                    </h3>
                    <p>
                        {songInfo?.artists?.[0]?.name}
                    </p>
                </div>
            </div>
            {/** center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon 
                //onClick={ ()=> spotifyApi.skipToPrevious()} -- the api is not working for this function 
                className="button"
                />
                { isPlaying?(
                        <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
                    )
                    :(
                        <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
                    )
                }
                <FastForwardIcon 
                  // onClick={()=>spotifyApi.skipToNext()} -- the api is not working
                  className="button"
                  />
            </div>
            {/** right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end">
                <VolumeDownIcon className="button" onClick={()=>{
                    if(volume > 0){
                        setVolume(volume-10)
                    }
                }}/>
                    <input type="range" 
                    className="w-14 md:w-28" 
                    value={volume} 
                    min={0} 
                    max={100}
                    onChange = {(e)=>setVolume(Number(e.target.value))}
                    />
                <VolumeUpIcon className="button" onClick={()=>{
                    if(volume < 0){
                        setVolume(volume+10)
                    }
                }} />
            </div>
        </div>
    )
}

export default Player
