import { useState, useEffect } from 'react'
import { Menu, X, Phone, Calendar } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ NAVIGATION
 * 
 * Navegación premium diseñada según el Brandbook:
 * - Logo con tipografía Dream Orphans
 * - Links con hover effects dorados
 * - CTA prominentes
 * - Mobile menu elegante
 * - Scroll behavior (cambia al hacer scroll)
 */

const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Beauty Bar', href: '#beauty-bar' },
  { name: 'Nosotros', href: '#nosotros' },
]

interface NavigationProps {
  onBook?: () => void
}

export function Navigation({ onBook }: NavigationProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.replace('#', ''))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-350 ease-out",
        isScrolled 
          ? "bg-beute-cream/95 backdrop-blur-xl shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="section-padding">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#inicio')
            }}
            className="flex items-center gap-3 group"
          >
            {/* Logo Icon */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Outer circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#AC802A" 
                  strokeWidth="1.5"
                  className="transition-all duration-300 group-hover:stroke-beute-gold-light"
                />
                {/* B letter */}
                <text 
                  x="50" 
                  y="60" 
                  textAnchor="middle" 
                  fill="#AC802A" 
                  fontSize="44" 
                  fontFamily="serif"
                  className="transition-all duration-300 group-hover:fill-beute-gold-light"
                >
                  B
                </text>
                {/* Decorative leaf */}
                <path 
                  d="M68 32 Q73 37 71 47 Q68 42 65 47 Q63 37 68 32" 
                  fill="none" 
                  stroke="#AC802A" 
                  strokeWidth="1"
                  className="transition-all duration-300 group-hover:stroke-beute-gold-light"
                />
              </svg>
            </div>
            
            {/* Logo Text */}
            <div className="hidden sm:block">
              <h1 className="font-dream text-2xl text-beute-earth-deep leading-none transition-colors group-hover:text-beute-gold">
                Beauté
              </h1>
              <p className="text-[10px] text-beute-taupe tracking-[0.2em] uppercase">
                Dra. Meyryn Carrillo
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href)
                }}
                className={cn(
                  "relative font-lato font-medium text-sm transition-colors duration-250",
                  activeSection === link.href.replace('#', '')
                    ? "text-beute-gold"
                    : "text-beute-earth-deep hover:text-beute-gold"
                )}
              >
                {link.name}
                {/* Active indicator */}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-beute-gold transition-all duration-300",
                  activeSection === link.href.replace('#', '') ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+50688888888" 
              className="flex items-center gap-2 text-beute-earth-deep hover:text-beute-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+506 8888 8888</span>
            </a>
            <ButtonLuxury
              variant="primary"
              size="sm"
              onClick={onBook || (() => scrollToSection('#agendar'))}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Agendar Cita
            </ButtonLuxury>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-beute-earth-dark hover:text-beute-gold transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-350 ease-out",
            isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft p-4 border border-beute-taupe-light/30">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className={cn(
                    "px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    activeSection === link.href.replace('#', '')
                      ? "text-beute-gold bg-beute-gold/10"
                      : "text-beute-earth-dark hover:text-beute-gold hover:bg-beute-gold/5"
                  )}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-beute-taupe-light/30 space-y-3">
              <a 
                href="tel:+50688888888" 
                className="flex items-center gap-2 text-beute-earth-dark px-4 py-2"
              >
                <Phone className="w-4 h-4 text-beute-gold" />
                <span className="text-sm font-medium">+506 8888 8888</span>
              </a>
              <ButtonLuxury
                variant="primary"
                className="w-full"
                onClick={onBook || (() => scrollToSection('#agendar'))}
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Agendar Cita
              </ButtonLuxury>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// Utility for className merging
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
