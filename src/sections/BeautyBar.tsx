import { Sparkles, Clock, Heart, Leaf } from 'lucide-react'
import { SectionHeader, SectionContainer } from '@/components/ui/section-header'
import { CardLuxury, CardBadge } from '@/components/ui/card-luxury'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ BEAUTY BAR SECTION
 * 
 * Sección de Beauty Bar & Wellness:
 * - Terapia Intravenosa (IV Drips)
 * - Manicura & Pedicura Spa
 * - Ambiente de lujo y relajación
 */

const beautyServices = [
  {
    id: 'terapia-iv',
    title: 'Terapia Intravenosa',
    subtitle: 'IV Drips',
    description: 'Recupera tu energía y vitalidad con nuestras fórmulas de vitaminas y minerales administradas directamente en el torrente sanguíneo para una absorción óptima.',
    image: '/images/terapia-iv.jpg',
    duration: '45-60 min',
    price: '₡75,000',
    benefits: ['Hidratación profunda', 'Aumento de energía', 'Refuerzo inmunológico', 'Recuperación rápida'],
    category: 'Wellness',
    isNew: true,
  },
  {
    id: 'manicura-pedicura',
    title: 'Manicura & Pedicura',
    subtitle: 'Spa Experience',
    description: 'Servicios de manicura y pedicura spa con técnicas clínicas, productos premium y atención meticulosa al detalle para manos y pies perfectos.',
    image: '/images/manicure-pedicure.jpg',
    duration: '60-90 min',
    price: '₡35,000',
    benefits: ['Hidratación profunda', 'Tratamiento de cutículas', 'Esmaltado premium', 'Masaje relajante'],
    category: 'Beauty Bar',
    popular: true,
  }
]

const features = [
  {
    icon: Sparkles,
    title: 'Productos Premium',
    description: 'Utilizamos solo productos de la más alta calidad para resultados excepcionales.',
    color: 'gold'
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description: 'Cada tratamiento se adapta a tus necesidades específicas y objetivos.',
    color: 'rose'
  },
  {
    icon: Clock,
    title: 'Horario Flexible',
    description: 'Atención de lunes a sábado con horarios que se adaptan a tu vida.',
    color: 'olive'
  }
]

interface BeautyBarProps {
  onBookService?: (serviceId: string) => void
}

export function BeautyBar({ onBookService }: BeautyBarProps = {}) {
  return (
    <SectionContainer 
      id="beauty-bar" 
      className="bg-gradient-to-b from-beute-cream to-beute-cream-light/30"
    >
      {/* Section Header */}
      <div className="flex justify-center">
        <SectionHeader
          label="Beauty Bar & Wellness"
          labelIcon={<Heart className="w-4 h-4" />}
          title="Bienestar y"
          titleHighlight="Belleza"
          subtitle="Espacios exclusivos diseñados para tu relajación total. Disfruta de tratamientos que nutren cuerpo y alma en un ambiente de lujo."
          align="center"
        />
      </div>

      {/* Services - Alternating Layout */}
      <div className="space-y-12 md:space-y-16 lg:space-y-20">
        {beautyServices.map((service, index) => (
          <div 
            key={service.id}
            className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image */}
            <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative rounded-3xl overflow-hidden shadow-elegant group">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/50 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {service.isNew && (
                    <CardBadge variant="rose">Nuevo</CardBadge>
                  )}
                  {service.popular && (
                    <CardBadge variant="gold">Popular</CardBadge>
                  )}
                </div>
                
                {/* Duration & Price */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <Clock className="w-4 h-4 text-beute-gold" />
                    <span className="text-sm font-medium text-beute-earth-dark">{service.duration}</span>
                  </div>
                  <div className="bg-beute-gold rounded-full px-4 py-2 shadow-gold">
                    <span className="text-sm font-medium text-white">Desde {service.price}</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative frame */}
              <div className={`absolute -z-10 w-full h-full border-2 border-beute-gold/20 rounded-3xl hidden lg:block ${
                index % 2 === 0 ? '-bottom-4 -right-4' : '-bottom-4 -left-4'
              }`} />
            </div>

            {/* Content */}
            <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              {/* Category */}
              <span className="inline-block text-xs font-lato font-semibold uppercase tracking-wider text-beute-gold mb-3">
                {service.category}
              </span>
              
              {/* Title */}
              <h3 className="font-dream text-2xl sm:text-3xl lg:text-4xl text-beute-earth-dark mb-2">
                {service.title}
              </h3>
              <p className="text-beute-gold font-medium mb-4">{service.subtitle}</p>
              
              {/* Description */}
              <p className="text-beute-earth-medium font-light leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Benefits */}
              <div className="mb-8">
                <h4 className="font-dream text-lg text-beute-earth-dark mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-beute-gold" /> 
                  Beneficios
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.benefits.map((benefit, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2.5"
                    >
                      <Leaf className="w-4 h-4 text-beute-gold flex-shrink-0" />
                      <span className="text-sm text-beute-earth-dark">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <ButtonLuxury 
                  variant="primary"
                  onClick={() => onBookService?.(service.id)}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Reservar Ahora
                </ButtonLuxury>
                <ButtonLuxury 
                  variant="outline"
                  onClick={() => document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Más Servicios
                </ButtonLuxury>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="mt-16 md:mt-20 lg:mt-24">
        <CardLuxury variant="glass" padding="xl" className="border border-beute-gold/10">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const colorClasses = {
                gold: 'bg-beute-gold/10 text-beute-gold',
                rose: 'bg-beute-rose/10 text-beute-rose',
                olive: 'bg-beute-olive/10 text-beute-olive',
              }
              
              return (
                <div key={feature.title} className="text-center">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center",
                    colorClasses[feature.color as keyof typeof colorClasses]
                  )}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-dream text-lg sm:text-xl text-beute-earth-dark mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-beute-earth-medium font-light">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </CardLuxury>
      </div>
    </SectionContainer>
  )
}

// Utility for className merging
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
