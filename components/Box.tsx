import { twMerge } from "tailwind-merge"; // Merge multiple Tailwind CSS classes together, resolves conflicts between them

interface BoxProps {
    children: React.ReactNode;
    className?: string;
}

// Box is a functional React component that uses the BoxProps interface for it's props
// Contains sidebar items and song library inside
const Box: React.FC<BoxProps> = ({children, className}) => {
    return (
        <div className={twMerge(`bg-neutral-900 rounded-lg h-fit w-full`, className)}>
            {children}
        </div>
    );
}

export default Box;