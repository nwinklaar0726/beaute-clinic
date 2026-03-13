import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * BEAUTÉ LUXURY BUTTON COMPONENT
 * 
 * Botones diseñados según el Brandbook de Beauté:
 * - Gradientes dorados suaves para CTAs primarios
 * - Bordes elegantes para botones secundarios
 * - Estados hover con micro-interacciones
 * - Variantes para diferentes contextos (hero, cards, forms)
 */

const buttonLuxuryVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-lato font-semibold text-sm tracking-wide transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: Gold gradient - CTAs principales
        primary: [
          "bg-gradient-to-r from-beute-gold via-beute-gold-light to-beute-gold",
          "text-white shadow-gold",
          "hover:shadow-gold-lg hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-gold",
          "bg-[length:200%_100%] hover:bg-[position:100%_0]",
        ],
        
        // Secondary: Outline with gold border
        secondary: [
          "bg-transparent border-2 border-beute-earth-deep text-beute-earth-deep",
          "hover:bg-beute-earth-deep hover:text-white hover:shadow-soft",
          "active:scale-[0.98]",
        ],
        
        // Outline Gold: Para fondos claros
        outline: [
          "bg-transparent border-2 border-beute-gold text-beute-gold",
          "hover:bg-beute-gold hover:text-white hover:shadow-gold",
          "active:scale-[0.98]",
        ],
        
        // Ghost: Subtle hover effect
        ghost: [
          "bg-transparent text-beute-earth-medium",
          "hover:text-beute-gold hover:bg-beute-gold/5",
        ],
        
        // Soft: Light background with hover
        soft: [
          "bg-beute-gold/10 text-beute-gold border border-beute-gold/20",
          "hover:bg-beute-gold/20 hover:border-beute-gold/30",
        ],
        
        // White: For dark backgrounds
        white: [
          "bg-white text-beute-earth-deep shadow-soft",
          "hover:bg-beute-cream hover:shadow-soft-lg hover:-translate-y-0.5",
          "active:translate-y-0",
        ],
        
        // Rose: Accent variant
        rose: [
          "bg-beute-rose text-white shadow-md",
          "hover:bg-beute-rose-dark hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0",
        ],
        
        // Olive: Wellness/nature variant
        olive: [
          "bg-beute-olive text-white shadow-md",
          "hover:bg-beute-olive-dark hover:shadow-lg hover:-translate-y-0.5",
          "active:translate-y-0",
        ],
      },
      size: {
        default: "h-11 px-8",
        sm: "h-9 px-6 text-xs",
        lg: "h-13 px-10 text-base",
        xl: "h-14 px-12 text-base",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-13 w-13",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonLuxuryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonLuxuryVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const ButtonLuxury = React.forwardRef<HTMLButtonElement, ButtonLuxuryProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonLuxuryVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    )
  }
)
ButtonLuxury.displayName = "ButtonLuxury"

export { ButtonLuxury, buttonLuxuryVariants }
