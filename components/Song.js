import { useRecoilState } from "recoil"
import { isPlayingState, CurrentTrackIdState, isPlayError } from "../atom/songAtom"
import { millisToMinutesAndSeconds } from "../hooks/time"
import useSpotify from "../hooks/useSpotify"
import spotifyApi from "../lib/spotify"


function Song({order , track}) {
    const spotifyApi = useSpotify()
    const [currentStateId , setCurrentTrackStateId] = useRecoilState(CurrentTrackIdState)
    const [isPlaying , setIsPlaying] = useRecoilState(isPlayingState)
    const [isPlayErrorOccur, setIsPlayErrorOccur] = useRecoilState(isPlayError)

    const playSong =  ()=>{
        setCurrentTrackStateId(track.track.id)
        setIsPlaying(true)
       
            spotifyApi.play({
                uris : [track.track.uri] 
            }, function (err, data){
                console.log("this is err : ", err)
                if(err.name === "WebapiPlayerError"){
                    
                        setIsPlayErrorOccur(true)
                        console.log(isPlayErrorOccur)
                
                }
                console.log("this is data : ", data)
            })
       

    }

    const playSongWall = ()=>{
        try{
            playSong()
        }catch{
            console.log('got the error now')
        }
    }

    return (
        <div className="grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
             onClick={playSongWall}
        >
            <div className="flex items-center space-x-5 space-y-3">
                <p>{order+1}</p>
                <img className="h-10 w-10" src={track.track.album.images[0].url} alt="" />
                <div>
                    <p className="w-36 md:w-64 text-white truncate">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 hidden md:inline">{track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song
