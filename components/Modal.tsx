import * as Dialog from "@radix-ui/react-dialog"; // provides unstyled, accessible components 
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;                    // indicates whether modal is open
  onChange: (open: boolean) => void;  // function to handle change in modal's open state
  title: string;
  description: string;
  children: React.ReactNode;          // any child components or elements to be rendered inside the modal
}

const Modal: React.FC<ModalProps> = ( {isOpen, onChange, title, description, children}) => {
  return ( 
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}> {/** Main container, controls open state */}
      <Dialog.Portal>                                                        {/** Ensures modal appears above other content */}
        <Dialog.Overlay                                                        // Background overlay
          className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0"  
        />
        <Dialog.Content                                                        // Modal content, mobile and desktop friendly
          className="
            fixed 
            drop-shadow-md 
            border 
            border-neutral-700 
            top-[50%] 
            left-[50%] 
            max-h-full 
            h-full 
            md:h-auto 
            md:max-h-[85vh] 
            w-full
            md:w-[90vw] 
            md: max-w-[450px] 
            translate-x-[-50%] 
            translate-y-[-50%] 
            rounded-md 
            bg-neutral-800 
            p-[25px] 
            focus:outline-none"
        >
          <Dialog.Title className="text-xl text-center text-bold mb-4">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm leading-normal text-center">
            {description}
          </Dialog.Description>
          <div>
            {children}
          </div>
          <Dialog.Close asChild>                                {/** Button to close the modal */}
            <button
              className="
                text-neutral-400
                hover:text-white
                absolute
                top-[10px]
                right-[10px]
                inline-flex
                h-[25px]
                w-[25px]
                appearance-none
                items-center
                justify-center
                rounded-full
                focus:outline-none
              "
            >
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
   );
}
 
export default Modal;
