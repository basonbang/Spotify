"use client"; 

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import SubscribeModal from "@/components/SubscribeModal";
import { ProductsWithPrice } from "@/types";

interface ModalProviderProps {
  products: ProductsWithPrice[];
}
// Conditionally render modals only after component is mounted on the client side.
const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {

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
      <SubscribeModal products={products} />
    </>
   );
}
 
export default ModalProvider;