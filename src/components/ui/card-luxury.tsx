import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * BEAUTÉ LUXURY CARD COMPONENT
 * 
 * Tarjetas diseñadas según el Brandbook de Beauté:
 * - Sombras suaves y elegantes
 * - Bordes sutiles con opacidad
 * - Variantes: default, glass, bordered, elevated
 * - Hover effects con elevación
 */

// Card container variants
const cardVariants = cva(
  "relative overflow-hidden rounded-2xl transition-all duration-450 ease-out",
  {
    variants: {
      variant: {
        // Default: Soft shadow, clean
        default: [
          "bg-beute-nude",
          "shadow-soft",
          "hover:shadow-elegant hover:-translate-y-1",
        ],
        
        // Glass: Translucent with blur
        glass: [
          "bg-white/80 backdrop-blur-xl",
          "border border-white/50",
          "shadow-soft",
          "hover:shadow-elegant hover:-translate-y-1",
        ],
        
        // Bordered: Subtle border, no shadow by default
        bordered: [
          "bg-beute-nude",
          "border border-beute-earth-deep/8",
          "hover:border-beute-gold/30 hover:shadow-soft",
        ],
        
        // Elevated: More prominent shadow
        elevated: [
          "bg-white",
          "shadow-elegant",
          "hover:shadow-[0_20px_60px_rgba(81,53,12,0.15)] hover:-translate-y-2",
        ],
        
        // Dark: For contrast sections
        dark: [
          "bg-beute-earth-deep",
          "text-white",
          "hover:shadow-lg",
        ],
        
        // Gold accent: Gold border highlight
        gold: [
          "bg-beute-cream",
          "border-2 border-beute-gold/20",
          "hover:border-beute-gold/40 hover:shadow-gold",
        ],
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

// Card header
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Card title
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-dream text-2xl text-beute-earth-deep leading-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Card subtitle
const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm font-lato text-beute-gold font-medium tracking-wide",
      className
    )}
    {...props}
  />
))
CardSubtitle.displayName = "CardSubtitle"

// Card description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-body-sm text-beute-earth-medium font-light leading-relaxed",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Card content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Card footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 mt-auto", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Card image container
const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { aspectRatio?: "video" | "square" | "portrait" | "wide" }
>(({ className, aspectRatio = "video", ...props }, ref) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    />
  )
})
CardImage.displayName = "CardImage"

// Card image with hover zoom
const CardImageHover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    src: string 
    alt: string
    aspectRatio?: "video" | "square" | "portrait" | "wide"
    overlay?: React.ReactNode
  }
>(({ className, src, alt, aspectRatio = "video", overlay, ...props }, ref) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden group",
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/60 via-transparent to-transparent">
          {overlay}
        </div>
      )}
    </div>
  )
})
CardImageHover.displayName = "CardImageHover"

// Card badge
const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "gold" | "rose" | "olive" | "success" }
>(({ className, variant = "gold", children, ...props }, ref) => {
  const variantClasses = {
    gold: "bg-beute-gold/10 text-beute-gold border-beute-gold/30",
    rose: "bg-beute-rose/10 text-beute-rose border-beute-rose/30",
    olive: "bg-beute-olive/10 text-beute-olive border-beute-olive/30",
    success: "bg-beute-success-pale text-beute-success border-beute-success/30",
  }
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1",
        "text-xs font-lato font-semibold uppercase tracking-wider rounded-full border",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})
CardBadge.displayName = "CardBadge"

// Main Card component
interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
  interactive?: boolean
}

const CardLuxury = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding }),
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardLuxury.displayName = "CardLuxury"

export {
  CardLuxury,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  CardImageHover,
  CardBadge,
  cardVariants,
}
