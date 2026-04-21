import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.95] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#22874a] text-white border border-[#22874a] shadow-sm hover:bg-[#1a6b3c] rounded-[50px]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-[50px]",
        outline: "border border-[#22874a] bg-transparent text-[#22874a] shadow-sm hover:bg-[#22874a]/5 rounded-[50px]",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 rounded-[50px]",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-lg",
        link: "text-[#22874a] underline-offset-4 hover:underline",
        gold: "bg-[var(--softball-gold)] text-[#1c2333] border border-[var(--softball-gold)] shadow-sm hover:brightness-110 rounded-[50px]",
        "dark-filled": "bg-[#1c2333] text-white border border-[#1c2333] shadow-sm hover:bg-[#283044] rounded-[50px]",
        "outline-dark": "border border-current bg-transparent text-foreground shadow-sm hover:bg-foreground/5 rounded-[50px]",
        "outline-on-dark": "border border-white bg-transparent text-white shadow-sm hover:bg-white/10 rounded-[50px]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
