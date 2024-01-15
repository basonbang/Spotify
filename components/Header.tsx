"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx"
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import usePlayer from "@/hooks/usePlayer";

interface HeaderProps {
  children: React.ReactNode;
  className ?: string;
}

const Header: React.FC<HeaderProps> = ( {children, className }) => {
  const player = usePlayer();
  const supabaseClient = useSupabaseClient();
  const { user, subscription } = useUser();

  const authModal = useAuthModal();
  const router = useRouter();

  const handleLogout = async () => {
    const { error }  = await supabaseClient.auth.signOut();

    // Reset any playing songs when logging out
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);  
    } else {
      toast.success('Logged out!');
    }
  }

  return ( 
    <div className={twMerge(`h-fit bg-gradient-to-b from-emerald-800 p-6`, className)}>
      <div className="w-full mb-4 flex items-center justify-between">

        {/** Medium-sized display layout */}
        <div className="hidden md:flex gap-x-2 items-center"> 
          {/** Backwards button */}
          <button 
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35}></RxCaretLeft>
          </button>
          {/** Forwards button */}
          <button 
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight className="text-white" size={35}></RxCaretRight>
          </button>
        </div>

        {/** Mobile view layout */}
        <div className="flex md:hidden gap-x-2 items-center">
          {/** Home button */}
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-black" size={20}/>
          </button>
          {/** Search button */}
          <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-black" size={20}/>
          </button>
        </div>

        {/** Conditionally render logout + profile if user is signed in */}
        <div className="flex justify-between items-center gap-x-4">
          { user ? (  
            <div className="flex gap-x-4 items-center"> 
              <Button onClick={handleLogout} className="bg-white px-6 py-2">
                Logout
              </Button>
              <Button onClick={() => router.push('/account')} className="bg-white">
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            // Conditionally render sign up + log in if user is signed out
            <>
              <div>
                <Button onClick={authModal.onOpen} className="bg-transparent text-neutral-300 font-medium">
                  Sign Up
                </Button>
              </div>
              <div>
                <Button onClick={authModal.onOpen}  className="bg-white px-6 py-2">
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
   );
}
 
export default Header;