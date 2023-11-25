"use client"; 

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";

// Conditionally render modals only after component is mounted on the client side.
const ModalProvider = () => {

  const [isMounted, setIsMounted] = useState(false);  // Track whether the component has mounted on the client

  // Effect runs once after initial render 
  useEffect(() => {
    setIsMounted(true); //  Mount component to client
  }, []);

  if (!isMounted) return null;  

  // Only render once provider is mounted (inserted into DOM)
  return ( 
    <>
      <AuthModal />
      <UploadModal />
    </>
   );
}
 
export default ModalProvider;