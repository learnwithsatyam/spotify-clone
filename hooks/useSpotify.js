import { signIn, useSession } from "next-auth/react"
import spotifyApi from "../lib/spotify"
import { useEffect } from "react"


// this is a custom hook. Yes, you can actually make custom hooks in react and next js
function useSpotify() {
    const {data: session, status} = useSession()
    useEffect(() => {
       if(session){
           //if refresh access token attempt fails, direct user to login
           if(session.error == 'refreshAccessTokenError'){
               signIn()
           }

           spotifyApi.setAccessToken(session.user.accessToken)
       }
    }, [session]) 
    return (
        spotifyApi
    )
}

export default useSpotify
