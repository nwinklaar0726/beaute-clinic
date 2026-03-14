import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Volume2, VolumeX, Pause } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ HERO SECTION - VIDEO/IMAGE BACKGROUND
 * 
 * Hero estilo Bellas Place con:
 * - Video de fondo con fallback a imagen
 * - Overlay oscuro degradado para legibilidad
 * - Controles de video (play/pause, mute/unmute)
 * - Animaciones suaves al cargar
 * - Diseño responsive optimizado
 */

interface HeroVideoProps {
  onBook?: () => void
  videoSrc?: string
  posterSrc?: string
}

export function HeroVideo({ 
  onBook, 
  videoSrc = '/videos/beaute-hero.mp4',
  posterSrc = '/images/hero-spa.jpg'
}: HeroVideoProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasVideo, setHasVideo] = useState(true)
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

  // Parallax effect on scroll
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
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Layer - Image/Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Image Background (Fallback) */}
        <div 
          className="parallax-bg absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Video Layer */}
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
        
        {/* Dark Overlays for better text readability */}
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Gradient from top - darker at top for navigation */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/60" />
        
        {/* Side gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* Gold tint overlay */}
        <div className="absolute inset-0 bg-beute-earth-deep/10 mix-blend-overlay" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-beute-gold/30 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 ease-out 
                        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <span className="w-2 h-2 bg-beute-gold rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Dra. Meyryn Carrillo
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/70 text-sm hidden sm:inline">
              Estética & Nutrición Integral
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-dream text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                         text-white leading-[1] mb-6 tracking-tight">
            <span className="block">Realza tu</span>
            <span className="block text-beute-gold mt-2">Belleza Natural</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 
                        font-light leading-relaxed px-4">
            Descubre el equilibrio perfecto entre <span className="text-white font-normal">ciencia médica</span> y 
            <span className="text-white font-normal"> bienestar spa</span>. Tratamientos exclusivos 
            para una transformación real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ButtonLuxury 
              variant="primary" 
              size="xl"
              onClick={onBook || (() => scrollToSection('#agendar'))}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto min-w-[220px] bg-beute-gold hover:bg-beute-gold-light 
                        text-white border-0 shadow-[0_4px_20px_rgba(172,128,42,0.4)]
                        hover:shadow-[0_6px_30px_rgba(172,128,42,0.6)] transition-all"
            >
              Reserva tu Cita
            </ButtonLuxury>
            
            <button 
              onClick={() => scrollToSection('#servicios')}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-full
                        bg-white/10 backdrop-blur-sm border border-white/30
                        text-white font-medium hover:bg-white/20 
                        transition-all w-full sm:w-auto justify-center"
            >
              <span>Ver Servicios</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats Row */}
          <div className={`grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-8 
                          border-t border-white/20 transition-all duration-1000 delay-300
                          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center">
              <p className="font-dream text-2xl sm:text-3xl md:text-4xl text-white mb-1">+10</p>
              <p className="text-white/60 text-xs uppercase tracking-wider">Años Exp.</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="font-dream text-2xl sm:text-3xl md:text-4xl text-white mb-1">+5K</p>
              <p className="text-white/60 text-xs uppercase tracking-wider">Pacientes</p>
            </div>
            <div className="text-center">
              <p className="font-dream text-2xl sm:text-3xl md:text-4xl text-white mb-1">98%</p>
              <p className="text-white/60 text-xs uppercase tracking-wider">Satisfechos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls - Only show if video is available */}
      {hasVideo && (
        <div className="absolute bottom-20 right-6 z-20 flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20
                      text-white hover:bg-black/50 transition-all"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20
                      text-white hover:bg-black/50 transition-all"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <button 
        onClick={() => scrollToSection('#servicios')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                   flex flex-col items-center gap-2 text-white/50 
                   hover:text-white transition-colors"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-current rounded-full animate-bounce" />
        </div>
      </button>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-beute-cream to-transparent z-10" />

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-15px) translateX(5px); 
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
