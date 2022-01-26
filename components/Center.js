import { ChevronDownIcon, UserRemoveIcon, LogoutIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import {shuffle} from 'lodash'
import { useState , useEffect} from "react"
import { RecoilState, useRecoilState, useRecoilValue } from "recoil"
import { playlistIdState, playlistState } from "../atom/playlistAtom"
import spotifyApi from "../lib/spotify"
import useSpotify from "../hooks/useSpotify"
import Songs from "./Songs"

function Center() {
    //remember that we have the session that stores all of the information of the user. We can get things like his name , email , profile photo and a lot more so let's do that.
    const {data: session} = useSession()
    const spotifyApi = useSpotify()
    const [color , setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState) // readonly version of the variable
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const colors = [
        'from-indigo-500',
        'from-blue-500',
        'from-green-500',
        'from-red-500',
        'from-purple-500',
        'from-yellow-500',
        'from-pink-500'

    ]
    useEffect(() => {
        setColor(shuffle(colors).pop()) /* we are using lodash library here */
    }, [playlistId])

    useEffect(()=>{
        spotifyApi.getPlaylist(playlistId).then((data)=>{
            setPlaylist(data.body)
        }).catch((err)=>{console.log('something went wrong : ', err)})
    }, [spotifyApi, playlistId, session])
    console.log(playlist)

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide text-white">
            <header className="absolute top-5 right-8 bg-black text-white rounded-full p-1 pr-2">
                <div className="flex items-center bg-black space-x-3 placeholder-opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
                     onClick={()=>{signOut()}}
                >
                    {/* session?. check whether the session exists or not */}
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt="" />
                    <h2>{session?.user.name}</h2>
                    <LogoutIcon className="h-5 w-5" />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img 
                    src={playlist?.images?.[0]?.url} 
                    className="h-44 w-44 shadow-2xl" 
                />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className ="text-2xl md:text-3xl lg:text-5xl">{playlist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center
