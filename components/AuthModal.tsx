"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";

import Modal from "./Modal";

import useAuthModal from "@/hooks/useAuthModal";

const AuthModal = () => {
  
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen} = useAuthModal();  // Helpers to close authentication modal

  const onChange = (open: boolean) => {
    if (!open){
      onClose();
    }
  }

  // close the modal if user successfully signs in
  useEffect(() => {
    if (session){
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]); 

  return ( 
    <Modal 
      title="Welcome back" 
      description="Login to your account" 
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth                               // Provides styling themes for authentication UI
        theme="dark"
        magicLink                         // Use github and magic link as authentication methods
        providers={["github"]}
        supabaseClient={supabaseClient}   // Passed to handle authentication requests
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#22c55e'
              }
            }
          }
        }}
      />
    </Modal>
   );
}
 
export default AuthModal;