import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'

import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music on this digital music service',
}

export const revalidate = 0; // never cache data, always revalidate page

export default async function RootLayout({
  children, // represent content that'll be loaded inside this general layout
}: {
  children: React.ReactNode
}) {

  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products}/> 
            <Sidebar songs={userSongs}>
              {children}
            </Sidebar>
            <Player />          
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
