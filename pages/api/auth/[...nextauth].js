import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

console.log("in auth api section")
async function refreshAccessToken(token){
    console.log("in refreshAccessToken function")
    try{
        spotifyApi.setAccessToken(token.accessToken).catch((err)=>{console.log("in setAccessToken")})
        spotifyApi.setRefreshToken(token.refreshToken).catch((err)=>{console.log("in setRefreshToken")})

        const {body: refreshedToken} = await spotifyApi.refreshAccessToken().catch((err)=>{console.log("in refreshAccessToken")})
        console.log("RefreshedToken is : ", refreshedToken)

        return {
            ...token,
            accessToken:refreshedToken.access_token,
            accessTokenExpires: Date.now()+refreshedToken.expires_in*1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    }catch(err){
        console.log(err)
        return {
            ...token,
            error: "refreshAccessTokenError"
        }
    }
}
console.log("iii")
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization:LOGIN_URL  //this url will literally pop up that spotify login page. If you are already logged in then it does send you to that page but it then sends you back as if you have just logged in throught that page when we authorize with spotify , the spotify gives us a special url. We pass in some scopes and it will decide what permissions we have to access things on spotify.
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET, // This is how we will encrypt the jwt tokens that we will get from spotify
  pages: {
      signIn : '/login',

  },
  debug: true,
  callbacks : {
      async jwt({token, account , user}){
          //first time signin
          console.log("inside jwt")
          if(account && user){
              console.log("first time signin")
              return{
                  ...token,
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  username: account.providerAccountId,
                  accessTokenExpires: account.expires_at*1000, // we are handling expiry time in milliseconds

              }

          }

          // return previous token if the accessToken has not expired yet
          if(Date.now()<token.accessTokenExpires){
              console.log("existing token is valid")
              return token;
          }

          // access token has expired so we need to refresh it...
          console.log("access token has expired, refreshing ...")
          return await refreshAccessToken(token)
      },

      async session({session,token}){
          console.log("in sessions function");
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.username = token.username;

          return session;
      }
  }
})
console.log("ddd")