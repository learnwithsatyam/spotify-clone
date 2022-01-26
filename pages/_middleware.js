import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// in this file , we are creating a middleware which works kinda like express middlewares. Here , this middleware will check if the user making a request to our app actually have a token or not. If user have a token then we simply let him throught otherise we throw him to the login page.

export async function middleware(req){
    //token will exist if the user is already logged in.
    const token = await getToken({req , secret: process.env.JWT_SECRET})

    //alow the request if the following is true :
   

    const {pathname}= req.nextUrl

    // 1.) if they have a token and try to go to loging page then redirect them to home route
    if(token && pathname == '/login'){
        return NextResponse.redirect('/')
    }

     // 1.) if token exists : 
    // pathname.includes("/api/auth") simply means that the user is trying to login so we should let him through.
    if(pathname.includes("/api/auth") || token){
        return NextResponse.next();  // this next() if basically working the same as the next() of express middleware
    }

    // 3.) redirect then to login page if they don't have the token and they are trying to access a protected route

    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login')
    }

    
}