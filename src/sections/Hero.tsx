import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Sparkles, Play, Award, Star, Clock, ChevronDown } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ HERO SECTION - CREATIVE VERSION
 * 
 * Hero inmersivo con:
 * - Partículas animadas doradas flotantes
 * - Video/lightbox opcional
 * - Carrusel de servicios destacados
 * - Stats animados con contador
 * - Efectos parallax y micro-interacciones
 */

interface HeroProps {
  onBook?: () => void
  onExplore?: () => void
}

// Servicios destacados para el carrusel
const featuredServices = [
  { name: 'Aparatología Avanzada', icon: '✨', color: 'from-beute-gold/20 to-beute-gold/5' },
  { name: 'Medicina Estética', icon: '💎', color: 'from-beute-rose/20 to-beute-rose/5' },
  { name: 'Nutrición Clínica', icon: '🥗', color: 'from-beute-olive/20 to-beute-olive/5' },
  { name: 'Spa & Wellness', icon: '🧖‍♀️', color: 'from-beute-taupe/20 to-beute-taupe/5' },
]

// Partículas flotantes
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-beute-gold/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

// Contador animado
const AnimatedCounter = ({ value, suffix = '' }: { value: string; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const numericValue = parseInt(value.replace(/\D/g, ''))
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setCount(numericValue)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [numericValue])
  
  return <span>{count}{suffix}</span>
}

export function Hero({ onBook }: HeroProps = {}) {
  const [activeService, setActiveService] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Auto-rotate services
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % featuredServices.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    { value: '10', suffix: '+', label: 'Años de Experiencia', icon: Award },
    { value: '5000', suffix: '+', label: 'Pacientes Felices', icon: Star },
    { value: '98', suffix: '%', label: 'Satisfacción', icon: Clock },
  ]

  return (
    <section 
      id="inicio" 
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-beute-cream"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-beute-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-beute-rose/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-beute-gold/5 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        <FloatingParticles />
        
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(172,128,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(172,128,42,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      <div className="section-padding relative z-10 w-full pt-24 lg:pt-28 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          
          {/* Left Content - 7 columns */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Trust Badge */}
            <div 
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-beute-gold/20 
                         rounded-full px-5 py-2.5 mb-6 shadow-soft animate-fade-in-up"
            >
              <div className="flex -space-x-2">
                <img src="/images/dra-meyryn.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <div className="w-8 h-8 rounded-full bg-beute-gold flex items-center justify-center border-2 border-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xs font-lato font-medium text-beute-earth-deep">
                Dra. Meyryn Carrillo <span className="text-beute-gold">•</span> Especialista Certificada
              </span>
            </div>

            {/* Main Title with animated gradient */}
            <h1 
              className="font-dream text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 
                         text-beute-earth-deep leading-[1.05] mb-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              <span className="relative inline-block">
                Belleza que
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="#AC802A" strokeWidth="3" strokeLinecap="round" className="animate-draw"/>
                </svg>
              </span>
              <span className="block mt-2 text-gradient-gold">transforma</span>
              <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl text-beute-earth-medium">
                tu vida desde adentro
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-base sm:text-lg text-beute-earth-medium/80 font-light leading-relaxed 
                         mb-8 max-w-2xl animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              En <strong className="text-beute-earth-deep font-normal">Beauté</strong>, combinamos 
              <span className="text-beute-gold font-medium"> ciencia médica</span> con 
              <span className="text-beute-rose font-medium"> experiencia spa</span> para crear 
              resultados naturales que resaltan tu belleza única.
            </p>

            {/* Service Carousel */}
            <div 
              className="flex flex-wrap gap-3 mb-8 animate-fade-in-up"
              style={{ animationDelay: '250ms' }}
            >
              {featuredServices.map((service, index) => (
                <button
                  key={service.name}
                  onClick={() => setActiveService(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300",
                    activeService === index 
                      ? `bg-gradient-to-r ${service.color} border border-beute-gold/30 shadow-soft`
                      : "bg-white/50 border border-beute-taupe/20 hover:border-beute-gold/30"
                  )}
                >
                  <span className="text-lg">{service.icon}</span>
                  <span className={cn(
                    "text-xs sm:text-sm font-medium transition-colors",
                    activeService === index ? "text-beute-earth-deep" : "text-beute-earth-medium"
                  )}>
                    {service.name}
                  </span>
                </button>
              ))}
            </div>

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
                Agendar Consulta Gratis
              </ButtonLuxury>
              
              <ButtonLuxury 
                variant="outline" 
                size="xl"
                onClick={() => setShowVideo(true)}
                leftIcon={<Play className="w-5 h-5" />}
              >
                Ver Video
              </ButtonLuxury>
            </div>

            {/* Stats Row */}
            <div 
              className="flex flex-wrap gap-6 sm:gap-10 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-beute-gold/20 to-beute-gold/5 
                                    flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-beute-gold" />
                    </div>
                    <div>
                      <p className="font-dream text-2xl text-beute-earth-deep">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="text-xs text-beute-taupe">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Image Section - 5 columns */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Decorative rotating ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[110%] h-[110%] border border-dashed border-beute-gold/20 rounded-full animate-spin-slow" />
              </div>
              
              {/* Main Image Card */}
              <div className="relative">
                {/* Golden frame corners */}
                <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-beute-gold rounded-tl-3xl" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-beute-gold rounded-br-3xl" />
                
                {/* Image container */}
                <div className="relative rounded-3xl overflow-hidden shadow-elegant group">
                  <img 
                    src="/images/dra-meyryn.jpg" 
                    alt="Dra. Meyryn Carrillo" 
                    className="w-full aspect-[4/5] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/50 via-transparent to-transparent" />
                  
                  {/* Floating testimonial card */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-beute-gold fill-beute-gold" />
                          ))}
                        </div>
                        <span className="text-xs text-beute-earth-medium">+500 reseñas 5 estrellas</span>
                      </div>
                      <p className="text-sm text-beute-earth-dark mt-2 font-medium">
                        "La mejor experiencia en medicina estética de Costa Rica"
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating badge - Awards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-soft border border-beute-gold/20 animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-beute-gold" />
                    <div>
                      <p className="font-dream text-lg text-beute-earth-deep">Top Rated</p>
                      <p className="text-[10px] text-beute-taupe">Clínica 2024</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating badge - Online Booking */}
                <div className="absolute top-1/2 -left-6 bg-beute-gold rounded-2xl px-4 py-3 shadow-gold">
                  <p className="text-white text-xs font-medium">Reserva Online</p>
                  <p className="font-dream text-2xl text-white">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-beute-taupe uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5 text-beute-gold" />
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="bg-white rounded-3xl p-2 max-w-3xl w-full">
            <div className="aspect-video bg-beute-earth-deep/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-beute-gold mx-auto mb-4" />
                <p className="text-beute-earth-medium">Video institucional próximamente</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          className="w-full h-auto" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="#FAEFE6" 
          />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes draw {
          from { stroke-dasharray: 200; stroke-dashoffset: 200; }
          to { stroke-dasharray: 200; stroke-dashoffset: 0; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-draw {
          animation: draw 1.5s ease-out forwards;
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  )
}

// Utility
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
