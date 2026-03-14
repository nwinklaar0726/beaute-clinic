import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Volume2, VolumeX, Pause } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ HERO SECTION - VIDEO BACKGROUND VERSION (Full Featured)
 * 
 * Hero tipo Bellas Place con:
 * - Video de fondo HD (autoplay, loop, muted por defecto)
 * - Overlay oscuro degradado multi-capa
 * - Controles de video (play/pause, mute/unmute)
 * - Fallback a imagen si no hay video
 * - Animaciones suaves al cargar
 * - Scroll parallax sutil
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
      const parallaxElements = sectionRef.current.querySelectorAll('.parallax')
      parallaxElements.forEach((el) => {
        const speed = 0.5
        ;(el as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`
      })
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Poster/Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ 
            backgroundImage: `url(${posterSrc})`,
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
        
        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        
        {/* Gold Accent */}
        <div className="absolute inset-0 bg-beute-gold/5 mix-blend-overlay" />
      </div>

      {/* Animated Particles Overlay */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className={`text-center transition-all duration-1000 ease-out 
                        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                          bg-white/10 backdrop-blur-md border border-white/20 mb-10
                          hover:bg-white/15 transition-all cursor-default">
            <span className="w-2 h-2 bg-beute-gold rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Dra. Meyryn Carrillo
            </span>
            <span className="text-white/40">|</span>
            <span className="text-white/70 text-sm">
              Estética & Nutrición Integral
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-dream text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl
                         text-white leading-[0.95] mb-8 tracking-tight">
            <span className="block parallax">Realza tu</span>
            <span className="block text-beute-gold parallax mt-2">Belleza Natural</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 
                        font-light leading-relaxed">
            Descubre el equilibrio perfecto entre <span className="text-white font-normal">ciencia médica</span> y 
            <span className="text-white font-normal"> bienestar spa</span>. Tratamientos exclusivos 
            para una transformación real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <ButtonLuxury 
              variant="primary" 
              size="xl"
              onClick={onBook || (() => scrollToSection('#agendar'))}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto min-w-[200px] bg-beute-gold hover:bg-beute-gold-light 
                        text-white border-0 shadow-[0_0_30px_rgba(172,128,42,0.4)]
                        hover:shadow-[0_0_40px_rgba(172,128,42,0.6)] transition-all"
            >
              Reserva tu Cita
            </ButtonLuxury>
            
            <button 
              onClick={() => scrollToSection('#servicios')}
              className="group flex items-center gap-3 px-8 py-4 rounded-full
                        bg-white/5 backdrop-blur-sm border border-white/20
                        text-white font-medium hover:bg-white/10 hover:border-white/30 
                        transition-all w-full sm:w-auto justify-center"
            >
              <span>Conoce Nuestros Servicios</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats Row */}
          <div className={`grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto pt-8 
                          border-t border-white/20 transition-all duration-1000 delay-300
                          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center">
              <p className="font-dream text-3xl sm:text-4xl md:text-5xl text-white mb-2">+10</p>
              <p className="text-white/50 text-xs sm:text-sm uppercase tracking-wider">Años Exp.</p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="font-dream text-3xl sm:text-4xl md:text-5xl text-white mb-2">+5K</p>
              <p className="text-white/50 text-xs sm:text-sm uppercase tracking-wider">Pacientes</p>
            </div>
            <div className="text-center">
              <p className="font-dream text-3xl sm:text-4xl md:text-5xl text-white mb-2">98%</p>
              <p className="text-white/50 text-xs sm:text-sm uppercase tracking-wider">Satisfechos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {hasVideo && (
        <div className="absolute bottom-24 right-6 z-20 flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20
                      text-white hover:bg-white/20 transition-all"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20
                      text-white hover:bg-white/20 transition-all"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <button 
        onClick={() => scrollToSection('#servicios')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 
                   flex flex-col items-center gap-3 text-white/50 
                   hover:text-white transition-colors group"
      >
        <span className="text-xs uppercase tracking-[0.3em] font-light">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-current rounded-full animate-bounce" />
        </div>
      </button>

      {/* Decorative Side Lines */}
      <div className="absolute top-0 left-8 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-8 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-10px) translateX(-10px); 
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-30px) translateX(5px); 
            opacity: 0.4;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
