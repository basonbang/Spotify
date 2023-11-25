"use client";

import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { useState} from "react";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);  
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  // Functions to help simplify managing form state, validation, submission, etc.
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    // Initialize form state with default values for each field
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  })

  // Handles modal close event 
  const onChange = (open: boolean) => {
    if (!open){
      reset();
      uploadModal.onClose(); 
    }
  }

  // Handles form submission                          
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // ⭐ The 'values' parameter is gathered from 'handleSubmit', it's all the data from the form fields registed with 'register'
    
    try {
      setIsLoading(true);  // 1. Set Loading State
      
      const imageFile = values.image?.[0];  // 2. Extract image and song file data from form values, if any
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user){  // 3. Check for missing fields
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();    // 4. Generate unique identifier to create unique file names for storage

      // 5. Upload song file to Supabase storage
      const {
        data: songData,
        error: songError,
      } = await supabaseClient
        .storage
        .from('songs')        // File cached for 3600 seconds/1 hour, won't overwrite a file with the same name if it alr exists
        .upload(`song-${values.title}-${uniqueID}`, songFile, { cacheControl: '3600', upsert: false});

      if (songError){
        setIsLoading(false);
        return toast.error('Failed song upload');
      }

      // 6. Upload image file to Supabase storage
      const {
        data: imageData,      // Rename data and error to more convenient names
        error: imageError,
      } = await supabaseClient
        .storage
        .from('images')
        .upload(`image-${values.title}-${uniqueID}`, imageFile, { cacheControl: '3600', upsert: false});

      if (imageError){
        setIsLoading(false);
        return toast.error('Failed image upload');
      }

      // 7. Insert new song into 'songs' table along with it's properties and paths
      const { error: supabaseError} = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      // 8. Refresh page, reset form, and close upload modal
      router.refresh();
      setIsLoading(false);
      toast.success("Song created!");
      reset();
      uploadModal.onClose();

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);  // Ensure that the loading state is reset regardless of wether process succeeds or encounters error
    }
  }


  return ( 
    <Modal 
      title="Add a song " 
      description="Upload an mp3 file" 
      isOpen={uploadModal.isOpen} 
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {/** Song title and author fields */}
        <Input id="title" disabled={isLoading} {...register('title', { required: true})} placeholder="Song title"/>
        <Input id="author" disabled={isLoading} {...register('author', { required: true})} placeholder="Song author"/>
        {/** Song file input field */}
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input id="song" type="file" disabled={isLoading} {...register('song', { required: true})} accept=".mp3" />
        </div>
        {/** Song image input field */}
        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input id="image" type="file" disabled={isLoading} {...register('image', { required: true})} accept="image/*" />
        </div>
        {/** Submit button */}
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
   );
}
 
export default UploadModal;