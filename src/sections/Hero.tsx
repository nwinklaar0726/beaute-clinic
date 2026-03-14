import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Volume2, VolumeX, ChevronDown } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ HERO SECTION - VIDEO BACKGROUND VERSION
 * 
 * Hero estilo Bellas Place con:
 * - Video de fondo (autoplay, loop, muted)
 * - Overlay oscuro degradado
 * - Tipografía grande y elegante
 * - CTAs prominentes
 * - Controles de video (mute/unmute)
 * - Scroll indicator
 */

interface HeroProps {
  onBook?: () => void
}

export function Hero({ onBook }: HeroProps = {}) {
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Animation on mount
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Fallback background image while video loads */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/images/hero-spa.jpg)',
            filter: 'brightness(0.7)'
          }}
        />
        
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/hero-spa.jpg"
          onLoadedData={() => setIsLoaded(true)}
        >
          {/* Placeholder - replace with actual video file */}
          <source src="/videos/beaute-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        {/* Gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-beute-gold/10 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="w-2 h-2 bg-beute-gold rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Clínica de Estética & Nutrición
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-dream text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                         text-white leading-[1.1] mb-6">
            <span className="block">Realza tu</span>
            <span className="block text-beute-gold">Belleza Natural</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 
                        font-light leading-relaxed">
            Experimenta el equilibrio perfecto entre <span className="text-white font-medium">ciencia médica</span> y 
            <span className="text-white font-medium"> bienestar spa</span>. Tratamientos personalizados 
            que transforman desde adentro hacia afuera.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ButtonLuxury 
              variant="primary" 
              size="xl"
              onClick={onBook || (() => scrollToSection('#agendar'))}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto bg-beute-gold hover:bg-beute-gold-light text-white 
                        border-0 shadow-gold-lg"
            >
              Agendar Consulta
            </ButtonLuxury>
            
            <button 
              onClick={() => scrollToSection('#servicios')}
              className="flex items-center gap-2 px-8 py-4 rounded-full
                        bg-white/10 backdrop-blur-sm border border-white/30
                        text-white font-medium hover:bg-white/20 transition-all
                        w-full sm:w-auto justify-center"
            >
              Explorar Servicios
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 
                          pt-8 border-t border-white/20">
            <div className="text-center">
              <p className="font-dream text-4xl sm:text-5xl text-white mb-1">+10</p>
              <p className="text-white/60 text-sm uppercase tracking-wider">Años de Experiencia</p>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <p className="font-dream text-4xl sm:text-5xl text-white mb-1">+5K</p>
              <p className="text-white/60 text-sm uppercase tracking-wider">Pacientes Felices</p>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block" />
            <div className="text-center">
              <p className="font-dream text-4xl sm:text-5xl text-white mb-1">98%</p>
              <p className="text-white/60 text-sm uppercase tracking-wider">Satisfacción</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <button
        onClick={toggleMute}
        className="absolute bottom-24 right-6 z-20 p-3 rounded-full 
                   bg-white/10 backdrop-blur-sm border border-white/20
                   text-white hover:bg-white/20 transition-all"
        aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Scroll Indicator */}
      <button 
        onClick={() => scrollToSection('#servicios')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                   flex flex-col items-center gap-2 text-white/60 
                   hover:text-white transition-colors group"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Descubre más</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden lg:block" />
      <div className="absolute bottom-1/4 right-8 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent hidden lg:block" />
      
      {/* Logo watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      text-[20rem] font-dream text-white/[0.02] pointer-events-none select-none hidden xl:block">
        B
      </div>
    </section>
  )
}
