import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Sidebar from '../components/Sidebar'
import Player from '../components/Player'

// we are using hero icons from tailwind


export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden" > {/*className="flex flex-col items-center justify-center min-h-screen py-2"*/}
      <Head>
        <title>Spotify 2.0 Clone By Satyam Shivhare</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />

      </main>
      <div className="sticky bottom-0">
       <Player />
      </div>

    </div>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context)

  return {
    props:{
      session,
    }
  }
}
