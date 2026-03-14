import { ArrowRight, Sparkles } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ HERO SECTION
 * 
 * Hero de alto impacto con foto prominente de la Dra. Meyryn
 * Diseñado según el Brandbook oficial
 */

interface HeroProps {
  onBook?: () => void
  onExplore?: () => void
}

export function Hero({ onBook, onExplore }: HeroProps = {}) {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const stats = [
    { 
      value: '+10', 
      label: 'Años de', 
      sublabel: 'Experiencia',
      color: 'gold'
    },
    { 
      value: '+5K', 
      label: 'Pacientes', 
      sublabel: 'Satisfechos',
      color: 'rose'
    },
    { 
      value: '100%', 
      label: 'Tratamientos', 
      sublabel: 'Personalizados',
      color: 'olive'
    },
  ]

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-beute-cream">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-leaf-pattern opacity-30" />
      
      <div className="section-padding relative z-10 w-full pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2.5 bg-beute-gold/10 border border-beute-gold/30 
                         rounded-full px-5 py-2.5 mb-6 animate-fade-in-up"
            >
              <Sparkles className="w-4 h-4 text-beute-gold" />
              <span className="text-xs font-lato font-semibold uppercase tracking-[0.2em] text-beute-gold">
                Dra. Meyryn Carrillo
              </span>
            </div>

            {/* Main Title */}
            <h1 
              className="font-dream text-5xl sm:text-6xl lg:text-7xl 
                         text-beute-earth-deep leading-[1.05] mb-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              Resultados
              <span className="block mt-2">
                <span className="text-gradient-gold">Satisfactorios</span>
              </span>
              <span className="block mt-2 text-4xl sm:text-5xl lg:text-6xl">
                sin alterar tu
                <span className="text-gradient-gold"> ritmo de vida</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-lg text-beute-earth-medium font-light leading-relaxed 
                         mb-8 max-w-xl animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              En <strong className="text-beute-earth-deep font-normal">Beauté</strong>, fusionamos la 
              precisión de la medicina estética con la serenidad de un spa médico de lujo. 
              Transforma tu bienestar con tratamientos personalizados.
            </p>

            {/* CTA Buttons */}
            <div 
              className="flex flex-wrap gap-4 mb-10 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <ButtonLuxury 
                variant="primary" 
                size="xl"
                onClick={onBook || (() => scrollToSection('#agendar'))}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Agendar Consulta
              </ButtonLuxury>
              
              <ButtonLuxury 
                variant="secondary" 
                size="xl"
                onClick={onExplore || (() => scrollToSection('#servicios'))}
              >
                Explorar Servicios
              </ButtonLuxury>
            </div>

            {/* Stats */}
            <div 
              className="flex flex-wrap gap-6 sm:gap-8 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              {stats.map((stat) => {
                const colorClasses = {
                  gold: 'bg-beute-gold/10 text-beute-gold',
                  rose: 'bg-beute-rose/10 text-beute-rose',
                  olive: 'bg-beute-olive/10 text-beute-olive',
                }
                
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      colorClasses[stat.color as keyof typeof colorClasses]
                    )}>
                      <span className="font-dream text-xl">{stat.value}</span>
                    </div>
                    <div>
                      <p className="text-xs text-beute-taupe uppercase tracking-wider">{stat.label}</p>
                      <p className="font-medium text-beute-earth-dark text-sm">{stat.sublabel}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Image - Dra. Meyryn */}
          <div className="order-1 lg:order-2 relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-2 sm:-left-4 w-24 h-24 bg-beute-gold/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-2 sm:-right-4 w-32 h-32 bg-beute-rose/20 rounded-full blur-2xl" />
            
            {/* Main Image Container */}
            <div className="relative">
              {/* Frame decoration */}
              <div className="absolute -top-3 -left-3 w-full h-full border-2 border-beute-gold/30 rounded-3xl" />
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-beute-gold/20 rounded-3xl" />
              
              {/* Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elegant">
                <img 
                  src="/images/dra-meyryn.jpg" 
                  alt="Dra. Meyryn Carrillo - Especialista en Medicina Estética y Nutrición" 
                  className="w-full aspect-[4/5] object-cover object-top"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/40 via-transparent to-transparent" />
                
                {/* Name badge */}
                <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-soft">
                    <p className="font-dream text-xl sm:text-2xl text-beute-earth-deep">Dra. Meyryn Carrillo</p>
                    <p className="text-beute-gold font-medium text-sm">Medicina Estética & Nutrición</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badge - Experience */}
              <div className="absolute -bottom-4 -left-4 bg-beute-gold rounded-2xl px-4 py-3 shadow-gold">
                <p className="font-dream text-3xl text-white">+10</p>
                <p className="text-white/80 text-xs">Años de Experiencia</p>
              </div>
              
              {/* Floating badge - Patients */}
              <div className="absolute top-8 -right-4 bg-white rounded-2xl px-4 py-3 shadow-soft border border-beute-gold/20">
                <p className="font-dream text-xl sm:text-2xl text-beute-gold">+5K</p>
                <p className="text-beute-earth-medium text-xs">Pacientes</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-auto" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#FAEFE6" 
          />
        </svg>
      </div>
    </section>
  )
}

// Utility for className merging
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
