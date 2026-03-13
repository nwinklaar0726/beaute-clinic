import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * BEAUTÉ SECTION HEADER COMPONENT
 * 
 * Headers de sección estandarizados según el Brandbook:
 * - Badge/label superior
 * - Título principal con gradiente opcional
 * - Subtítulo descriptivo
 * - Alineación configurable
 * - Animaciones suaves
 */

interface SectionHeaderProps {
  label?: string
  labelIcon?: React.ReactNode
  title: string
  titleHighlight?: string
  subtitle?: string
  align?: "left" | "center" | "right"
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  animated?: boolean
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({
    label,
    labelIcon,
    title,
    titleHighlight,
    subtitle,
    align = "center",
    className,
    titleClassName,
    subtitleClassName,
    animated = true,
  }, ref) => {
    const alignClasses = {
      left: "text-left items-start",
      center: "text-center items-center",
      right: "text-right items-end",
    }

    const animationClass = animated ? "animate-fade-in-up" : ""

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col max-w-3xl mb-12 lg:mb-16",
          alignClasses[align],
          className
        )}
      >
        {/* Label Badge */}
        {label && (
          <div 
            className={cn(
              "inline-flex items-center gap-2 bg-beute-gold/10 border border-beute-gold/30",
              "rounded-full px-4 py-2 mb-6 w-fit",
              animationClass
            )}
          >
            {labelIcon && (
              <span className="text-beute-gold">{labelIcon}</span>
            )}
            <span className="text-xs font-lato font-semibold uppercase tracking-[0.15em] text-beute-gold">
              {label}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 
          className={cn(
            "font-dream text-4xl sm:text-5xl lg:text-display-3 text-beute-earth-deep leading-tight",
            animationClass,
            animated && "animation-delay-100",
            titleClassName
          )}
        >
          {title}
          {titleHighlight && (
            <span className="block text-gradient-gold mt-2">{titleHighlight}</span>
          )}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p 
            className={cn(
              "mt-4 text-lg text-beute-earth-medium font-light leading-relaxed max-w-2xl",
              animationClass,
              animated && "animation-delay-200",
              subtitleClassName
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    )
  }
)
SectionHeader.displayName = "SectionHeader"

/**
 * SECTION DIVIDER
 * Divider elegante con gradiente dorado
 */
interface SectionDividerProps {
  variant?: "gradient" | "simple" | "dots"
  className?: string
}

const SectionDivider = React.forwardRef<HTMLDivElement, SectionDividerProps>(
  ({ variant = "gradient", className }, ref) => {
    if (variant === "simple") {
      return (
        <div 
          ref={ref} 
          className={cn("w-full h-px bg-beute-taupe-light/50 my-16", className)} 
        />
      )
    }

    if (variant === "dots") {
      return (
        <div 
          ref={ref} 
          className={cn("flex items-center justify-center gap-2 my-16", className)}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-beute-gold/40" />
          <span className="w-2 h-2 rounded-full bg-beute-gold/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-beute-gold/40" />
        </div>
      )
    }

    return (
      <div 
        ref={ref} 
        className={cn(
          "w-full h-px my-16",
          "bg-gradient-to-r from-transparent via-beute-gold/50 to-transparent",
          className
        )} 
      />
    )
  }
)
SectionDivider.displayName = "SectionDivider"

/**
 * SECTION CONTAINER
 * Contenedor estandarizado para secciones
 */
interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  id?: string
  withPattern?: boolean
  patternVariant?: "leaf" | "dot"
}

const SectionContainer = React.forwardRef<HTMLElement, SectionContainerProps>(
  ({ 
    children, 
    className, 
    innerClassName,
    id,
    withPattern = false,
    patternVariant = "leaf",
  }, ref) => {
    const patternClass = withPattern 
      ? patternVariant === "leaf" 
        ? "bg-leaf-pattern" 
        : "bg-dot-pattern"
      : ""

    return (
      <section 
        ref={ref}
        id={id}
        className={cn(
          "py-20 lg:py-28 xl:py-32 relative overflow-hidden",
          patternClass,
          className
        )}
      >
        <div className={cn("section-padding relative z-10", innerClassName)}>
          {children}
        </div>
      </section>
    )
  }
)
SectionContainer.displayName = "SectionContainer"

export { SectionHeader, SectionDivider, SectionContainer }
