import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// Inherit all properties from predefined React Input element
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{}

/* 
  Input component forwards a 'ref' attribute to the <input> element
  - Accepts all standard input attributes (via InputProps) + any additional props
  - 'ref' is assigned to the <input>, which allows parent components to interact with the actual input DOM node
*/
const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type, 
  disabled,
  ...props
}, ref) => {
  return (
    <input 
      type={type}
      className={twMerge(`
        flex 
        w-full 
        rounded-md 
        bg-neutral-700 
        border 
        border-transparent 
        px-3 
        py-3 
        text-sm   
        file:border-0 
        file:bg-transparent 
        file:text-sm 
        file:font-medium 
        placeholder:text-neutral-400
        disabled:cursor-not-allowed 
        disabled:opacity-50 
        focus:outline-none`, className)}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input";
 
export default Input;