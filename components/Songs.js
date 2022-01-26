import { useRecoilValue } from "recoil"
import { playlistState } from "../atom/playlistAtom"
import Song from "./Song"

function Songs() {
    const playlist = useRecoilValue(playlistState)
    console.log("this is songs : ",playlist)
    return (
        <div className = "p-8 flex flex-col space-y-1 pb-28 text-white">
            {playlist?.tracks.items.map((track , i)=>(
                
                    <Song key={track.id}  track={track} order={i} />
        
                
            ))}
        </div>
    )
}

export default Songs
