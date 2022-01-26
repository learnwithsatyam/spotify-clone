import {HomeIcon,
        SearchIcon,
        LibraryIcon,
        HeartIcon,
        RssIcon,
        PlusCircleIcon} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react';
import useSpotify from '../hooks/useSpotify';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atom/playlistAtom';


function Sidebar() {
    const spotifyApi = useSpotify()  // our custom hook
    const {data: session, status} = useSession();
    const [playlists , setPlaylists] = useState([])

    const [playlistId , setPlaylistId] = useRecoilState(playlistIdState)
    console.log("you picked : ", playlistId)

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then(data => {
                console.log(data.body.items)
                setPlaylists(data.body.items)
            })
        }
    }, [session , spotifyApi])
    console.log(session)
    return (
        <div className="text-gray-500 p-5 border-r border-gray-900 h-screen
                       scrollbar-hide overflow-y-scroll text-xs lg:text-sm sm:mx-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">{/*scrollbar-hide class comes from the tailwind-scrollbar-hide library*/}
            <div className="space-y-4 ">
                <a href="https://www.linkedin.com/in/satyam-shivhare">
                    <div className="flex items-center space-x-2 hover:text-white">
                        <img src="/developer.png" className=" h-8 w-8 rounded-full" />
                        <span className="space-y-0">
                            <h2>Satyam Shivhare - Developer</h2>
                        </span>
                    </div>
                </a>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon 
                        className="h-5 w-5"
                    />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon 
                        className="h-5 w-5"
                    />
                    <p>Your Library</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900" /> {/* here [0.1px] is a custom value. Tailwind with create this class on fly and apply border size of 0.1px */}
                
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon 
                        className="h-5 w-5"
                    />
                    <p>Create Playlists</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon 
                        className="h-5 w-5"
                    />
                    <p>Liked Songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon 
                        className="h-5 w-5"
                    />
                    <p>Your Episodes</p>
                </button> 

                {/* playlists */} 
                <p className="cursor-pointer hover:text-white">Playlist name ...</p>   
                {playlists.map((playlist) =>(
                    <p onClick = {()=>setPlaylistId(playlist.id)} key = {playlist.id} className="cursor-pointer hover:text-white">{playlist.name}</p>   

                ))}

            </div>
        </div>
    )
}

export default Sidebar
