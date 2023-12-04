"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from 'react-icons/hi'
import { BiSearch } from 'react-icons/bi';

import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Song } from "@/types";


// Defines shape of props that Sidebar expects.
interface SidebarProps {
  children: React.ReactNode;  // Receive 'children' prop, which can be anything considered a valid React node. 
  songs: Song[];
}

/* 
    Sidebar component: Is a React Functional Component which expects props that match the 'SidebarProps' interface
    Extracts 'children' prop directly from SidebarProps object passed to component 
*/
const Sidebar: React.FC<SidebarProps> = ({ children, songs }) => {

  const pathname = usePathname();
  const routes = useMemo(() => [  // Memoizes an array of different route objects
    {
      icon: HiHome,
      label: 'Home',
      active: pathname !== '/search', // Boolean which determines if current route is on '/search' or not
      href: '/',
    },
    {
      icon: BiSearch,
      label: 'Search',
      active: pathname === '/search',
      href: '/search'
    }
  ], [pathname]); // dependency array, recompute routes only if current pathname changees

  return (
    <div className="flex h-full">
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs}/> 
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;