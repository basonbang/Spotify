import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// Inherits all properties from React's defined HTML attributues for a <button> element, such as 'onClick', 'disabled', etc.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {} 

/* 
  Button component forwards a 'ref' attribute to the <button> element
  - Accepts all standard button attributes (via ButtonProps) + any additional props
  - 'ref' is assigned to the <button>, which allows parent components to interact with the actual button DOM node
*/
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  disabled,
  type = "button",
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={twMerge(`
        w-full 
        rounded-full 
        bg-green-500
        border
        border-transparent
        px-3 
        py-3 
        disabled:cursor-not-allowed 
        disabled:opacity-50
        text-black
        font-bold
        hover:opacity-75
        transition
      `, disabled && 'opacity-75 cursor-not-allowed', className
      )}
      disabled={disabled}
      ref={ref}   
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"; // useful in debugging
 
export default Button;