import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Volume2, VolumeX, Pause, ChevronRight } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ HERO SECTION - VIDEO/IMAGE BACKGROUND WITH SERVICES
 * 
 * Hero estilo Bellas Place con:
 * - Video/imagen de fondo
 * - Servicios destacados con imágenes
 * - Overlay oscuro degradado
 * - Controles de video
 */

interface HeroVideoProps {
  onBook?: () => void
  videoSrc?: string
  posterSrc?: string
}

// Servicios destacados para mostrar en el Hero
const featuredServices = [
  {
    id: 1,
    name: 'Aparatología Avanzada',
    image: '/images/aparatologia.jpg',
    description: 'Tecnología de punta para resultados visibles',
  },
  {
    id: 2,
    name: 'Medicina Estética',
    image: '/images/medicina-estetica.jpg',
    description: 'Tratamientos médicos personalizados',
  },
  {
    id: 3,
    name: 'Nutrición Clínica',
    image: '/images/nutricion.jpg',
    description: 'Planes nutricionales integrales',
  },
]

export function HeroVideo({ 
  onBook, 
  videoSrc = '/videos/beaute-hero.mp4',
  posterSrc = '/images/hero-spa.jpg'
}: HeroVideoProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasVideo, setHasVideo] = useState(true)
  const [activeService, setActiveService] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate services
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % featuredServices.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const scrolled = window.scrollY
      const rate = scrolled * 0.4
      const bgElement = sectionRef.current.querySelector('.parallax-bg') as HTMLElement
      if (bgElement) {
        bgElement.style.transform = `translateY(${rate}px) scale(1.1)`
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoError = () => {
    setHasVideo(false)
  }

  return (
    <section 
      id="inicio" 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="parallax-bg absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
            transform: 'scale(1.1)'
          }}
        />
        
        {hasVideo && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={posterSrc}
            onLoadedData={() => setIsLoaded(true)}
            onError={handleVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className={`text-center lg:text-left transition-all duration-1000 ease-out 
                          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                            bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="w-2 h-2 bg-beute-gold rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">
                Dra. Meyryn Carrillo
              </span>
            </div>

            {/* Title */}
            <h1 className="font-dream text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                           text-white leading-[1] mb-6">
              <span className="block">Realza tu</span>
              <span className="block text-beute-gold mt-2">Belleza Natural</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 mb-8 
                          font-light leading-relaxed">
              Descubre el equilibrio perfecto entre <span className="text-white">ciencia médica</span> y 
              <span className="text-white"> bienestar spa</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-10">
              <ButtonLuxury 
                variant="primary" 
                size="xl"
                onClick={onBook || (() => scrollToSection('#agendar'))}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto min-w-[200px] bg-beute-gold hover:bg-beute-gold-light 
                          text-white border-0 shadow-[0_4px_20px_rgba(172,128,42,0.4)]"
              >
                Reserva tu Cita
              </ButtonLuxury>
              
              <button 
                onClick={() => scrollToSection('#servicios')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-full
                          bg-white/10 backdrop-blur-sm border border-white/30
                          text-white font-medium hover:bg-white/20 transition-all"
              >
                <span>Ver Servicios</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8">
              <div>
                <p className="font-dream text-3xl text-white">+10</p>
                <p className="text-white/60 text-xs uppercase">Años Exp.</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="font-dream text-3xl text-white">+5K</p>
                <p className="text-white/60 text-xs uppercase">Pacientes</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <p className="font-dream text-3xl text-white">98%</p>
                <p className="text-white/60 text-xs uppercase">Satisfechos</p>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Services */}
          <div className={`hidden lg:block transition-all duration-1000 delay-300
                          ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Service Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <img 
                  src={featuredServices[activeService].image}
                  alt={featuredServices[activeService].name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Service Info */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-beute-gold text-sm font-medium mb-2 uppercase tracking-wider">
                    Servicio Destacado
                  </p>
                  <h3 className="font-dream text-2xl text-white mb-2">
                    {featuredServices[activeService].name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {featuredServices[activeService].description}
                  </p>
                </div>
              </div>

              {/* Service Thumbnails */}
              <div className="flex gap-3 mt-4">
                {featuredServices.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(index)}
                    className={`relative flex-1 h-20 rounded-xl overflow-hidden transition-all ${
                      activeService === index 
                        ? 'ring-2 ring-beute-gold ring-offset-2 ring-offset-black/50' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                  >
                    <img 
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-beute-gold/30 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-beute-gold/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>

        {/* Mobile Services Preview */}
        <div className="lg:hidden mt-8">
          <p className="text-white/60 text-sm uppercase tracking-wider mb-4 text-center">
            Nuestros Servicios
          </p>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 w-40 rounded-xl overflow-hidden relative"
              >
                <img 
                  src={service.image}
                  alt={service.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium">
                  {service.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {hasVideo && (
        <div className="absolute bottom-24 right-6 z-20 flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20
                      text-white hover:bg-black/50 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20
                      text-white hover:bg-black/50 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <button 
        onClick={() => scrollToSection('#servicios')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                   flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
        </div>
      </button>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-beute-cream to-transparent z-10" />
    </section>
  )
}
