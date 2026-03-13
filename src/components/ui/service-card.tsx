import * as React from "react"
import { ArrowRight, Clock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { CardLuxury, CardBadge, CardImageHover, CardContent, CardFooter } from "./card-luxury"
import { ButtonLuxury } from "./button-luxury"

/**
 * BEAUTÉ SERVICE CARD COMPONENT
 * 
 * Tarjetas de servicio diseñadas según el Brandbook:
 * - Imagen prominente con overlay
 * - Badge de categoría
 * - Título y descripción
 * - Metadatos (duración, precio)
 * - Lista de beneficios
 * - CTA para agendar
 */

interface ServiceCardProps {
  id?: string
  title: string
  subtitle?: string
  description: string
  image: string
  category: string
  duration?: string
  price?: string
  priceFrom?: boolean
  features?: string[]
  popular?: boolean
  isNew?: boolean
  onBook?: () => void
  className?: string
  variant?: "default" | "horizontal" | "compact"
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  ({
    title,
    subtitle,
    description,
    image,
    category,
    duration,
    price,
    priceFrom = true,
    features = [],
    popular = false,
    isNew = false,
    onBook,
    className,
    variant = "default",
  }, ref) => {
    // Determine badge variant and text
    const getBadge = () => {
      if (isNew) return { text: "Nuevo", variant: "rose" as const }
      if (popular) return { text: "Popular", variant: "gold" as const }
      return null
    }

    const badge = getBadge()

    // Horizontal layout
    if (variant === "horizontal") {
      return (
        <CardLuxury
          ref={ref}
          variant="glass"
          padding="none"
          className={cn("group grid md:grid-cols-2", className)}
        >
          {/* Image */}
          <CardImageHover
            src={image}
            alt={title}
            aspectRatio="video"
            className="md:aspect-auto"
            overlay={
              badge && (
                <div className="absolute top-4 left-4">
                  <CardBadge variant={badge.variant}>{badge.text}</CardBadge>
                </div>
              )
            }
          />

          {/* Content */}
          <CardContent className="p-6 lg:p-8 flex flex-col">
            <div className="mb-auto">
              <span className="text-xs font-lato font-semibold uppercase tracking-[0.15em] text-beute-gold mb-2 block">
                {category}
              </span>
              
              <h3 className="font-dream text-2xl lg:text-3xl text-beute-earth-deep mb-1">
                {title}
              </h3>
              
              {subtitle && (
                <p className="text-sm text-beute-earth-medium font-medium mb-3">
                  {subtitle}
                </p>
              )}
              
              <p className="text-beute-earth-medium font-light leading-relaxed mb-4">
                {description}
              </p>

              {/* Features */}
              {features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-beute-earth-dark">
                      <Check className="w-4 h-4 text-beute-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <CardFooter className="pt-4 border-t border-beute-taupe-light/30">
              <div className="flex items-center gap-4 mr-auto">
                {duration && (
                  <div className="flex items-center gap-1.5 text-sm text-beute-earth-medium">
                    <Clock className="w-4 h-4 text-beute-gold" />
                    {duration}
                  </div>
                )}
                {price && (
                  <div className="text-sm">
                    {priceFrom && <span className="text-beute-taupe">Desde </span>}
                    <span className="font-semibold text-beute-earth-deep">{price}</span>
                  </div>
                )}
              </div>
              
              <ButtonLuxury 
                variant="primary" 
                size="sm"
                onClick={onBook}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Agendar
              </ButtonLuxury>
            </CardFooter>
          </CardContent>
        </CardLuxury>
      )
    }

    // Compact layout (for grids)
    if (variant === "compact") {
      return (
        <CardLuxury
          ref={ref}
          variant="default"
          padding="none"
          className={cn("group", className)}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/70 via-beute-earth-deep/20 to-transparent" />
            
            {badge && (
              <div className="absolute top-3 left-3">
                <CardBadge variant={badge.variant}>{badge.text}</CardBadge>
              </div>
            )}
            
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-xs font-lato font-semibold uppercase tracking-wider text-beute-gold-pale">
                {category}
              </span>
              <h3 className="font-dream text-xl text-white mt-1">{title}</h3>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <p className="text-sm text-beute-earth-medium font-light line-clamp-2 mb-3">
              {description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-beute-earth-medium">
                {duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-beute-gold" />
                    {duration}
                  </span>
                )}
                {price && (
                  <span>{priceFrom ? "Desde " : ""}{price}</span>
                )}
              </div>
              
              <button 
                onClick={onBook}
                className="text-beute-gold hover:text-beute-gold-dark transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </CardContent>
        </CardLuxury>
      )
    }

    // Default vertical layout
    return (
      <CardLuxury
        ref={ref}
        variant="glass"
        padding="none"
        className={cn("group flex flex-col h-full", className)}
      >
        {/* Image */}
        <CardImageHover
          src={image}
          alt={title}
          aspectRatio="video"
          overlay={
            <>
              {badge && (
                <div className="absolute top-4 left-4">
                  <CardBadge variant={badge.variant}>{badge.text}</CardBadge>
                </div>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-lato font-semibold uppercase tracking-wider text-beute-gold-pale">
                  {category}
                </span>
                <h3 className="font-dream text-2xl text-white mt-1">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-white/80 mt-0.5">{subtitle}</p>
                )}
              </div>
            </>
          }
        />

        {/* Content */}
        <CardContent className="p-6 flex-grow flex flex-col">
          <p className="text-beute-earth-medium font-light leading-relaxed mb-4 flex-grow">
            {description}
          </p>

          {/* Features */}
          {features.length > 0 && (
            <ul className="space-y-2 mb-4">
              {features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-beute-earth-dark">
                  <Check className="w-4 h-4 text-beute-gold flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4 text-sm text-beute-earth-medium">
            {duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-beute-gold" />
                {duration}
              </div>
            )}
            {price && (
              <div>
                {priceFrom && <span className="text-beute-taupe">Desde </span>}
                <span className="font-semibold text-beute-earth-deep">{price}</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0">
          <ButtonLuxury 
            variant="primary" 
            className="w-full"
            onClick={onBook}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Reservar Ahora
          </ButtonLuxury>
        </CardFooter>
      </CardLuxury>
    )
  }
)
ServiceCard.displayName = "ServiceCard"

export { ServiceCard }
export type { ServiceCardProps }
