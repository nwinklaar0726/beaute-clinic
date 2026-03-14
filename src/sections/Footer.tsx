import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, Heart, ArrowUp, Leaf } from 'lucide-react'
import { ButtonLuxury } from '@/components/ui/button-luxury'

/**
 * BEAUTÉ FOOTER
 * 
 * Footer premium diseñado según el Brandbook:
 * - Logo y descripción de marca
 * - Links organizados en columnas
 * - Información de contacto
 * - Redes sociales
 * - Scroll to top button
 * - Patrón botánico decorativo
 */

const quickLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Beauty Bar', href: '#beauty-bar' },
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Agendar Cita', href: '#agendar' },
]

const services = [
  { name: 'Aparatología Avanzada', href: '#servicios' },
  { name: 'Medicina Estética', href: '#servicios' },
  { name: 'Terapia Intravenosa', href: '#beauty-bar' },
  { name: 'Manicura & Pedicura', href: '#beauty-bar' },
  { name: 'Nutrición Oncológica', href: '#servicios' },
]

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/beaute.cr', color: 'hover:text-pink-500' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/beaute.cr', color: 'hover:text-blue-500' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/beaute-cr', color: 'hover:text-blue-600' },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-beute-earth-deep text-white relative overflow-hidden">
      {/* Decorative Botanical Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="footer-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#AC802A" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>
      
      {/* Decorative Leaves */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M100 10 Q120 60 100 110 Q80 60 100 10" fill="none" stroke="#AC802A" strokeWidth="1" />
          <path d="M50 50 Q70 100 50 150" fill="none" stroke="#AC802A" strokeWidth="0.5" />
          <path d="M150 50 Q130 100 150 150" fill="none" stroke="#AC802A" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="section-padding relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {/* Logo */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#AC802A" strokeWidth="1.5" />
                  <text x="50" y="60" textAnchor="middle" fill="#AC802A" fontSize="44" fontFamily="serif">B</text>
                  <path d="M68 32 Q73 37 71 47 Q68 42 65 47 Q63 37 68 32" fill="none" stroke="#AC802A" strokeWidth="1" />
                </svg>
              </div>
              <div>
                <h3 className="font-dream text-2xl text-white">Beauté</h3>
                <p className="text-[10px] text-beute-taupe tracking-[0.2em] uppercase">
                  Dra. Meyryn Carrillo
                </p>
              </div>
            </div>
            
            <p className="text-beute-taupe-light text-sm leading-relaxed mb-6">
              Estética y Nutrición Integral. Fusionamos la precisión de la medicina estética 
              con la serenidad de un spa médico de lujo.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center",
                    "transition-all duration-250 hover:bg-beute-gold hover:scale-110",
                    social.color
                  )}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-dream text-lg text-white mb-6 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-beute-gold" />
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => { 
                      e.preventDefault() 
                      scrollToSection(link.href) 
                    }}
                    className="text-beute-taupe-light text-sm hover:text-beute-gold transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-beute-gold transition-all duration-250" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-dream text-lg text-white mb-6 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-beute-gold" />
              Nuestros Servicios
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    onClick={(e) => { 
                      e.preventDefault() 
                      scrollToSection(service.href) 
                    }}
                    className="text-beute-taupe-light text-sm hover:text-beute-gold transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-beute-gold transition-all duration-250" />
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-dream text-lg text-white mb-6 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-beute-gold" />
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-beute-gold flex-shrink-0 mt-0.5" />
                <span className="text-beute-taupe-light text-xs sm:text-sm">
                  San José, Costa Rica
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-beute-gold flex-shrink-0" />
                <a 
                  href="tel:+50688888888" 
                  className="text-beute-taupe-light text-sm hover:text-beute-gold transition-colors"
                >
                  +506 8888 8888
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-beute-gold flex-shrink-0" />
                <a 
                  href="mailto:info@beaute.cr" 
                  className="text-beute-taupe-light text-sm hover:text-beute-gold transition-colors"
                >
                  info@beaute.cr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-beute-gold flex-shrink-0 mt-0.5" />
                <span className="text-beute-taupe-light text-sm">
                  Lun - Vie: 9:00 - 19:00<br />
                  Sábado: 10:00 - 16:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-dream text-xl text-white mb-2">
                Únete a nuestra comunidad
              </h4>
              <p className="text-beute-taupe-light text-sm">
                Recibe tips de bienestar y promociones exclusivas.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 md:w-64 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-beute-taupe focus:outline-none focus:border-beute-gold transition-colors"
              />
              <ButtonLuxury variant="primary" size="sm">
                Suscribirse
              </ButtonLuxury>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-beute-taupe text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Beauté by Dra. Meyryn Carrillo. Todos los derechos reservados.
          </p>
          <p className="text-beute-taupe text-sm flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-beute-rose fill-beute-rose" /> para tu bienestar
          </p>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        onClick={scrollToTop} 
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-beute-gold rounded-full shadow-gold flex items-center justify-center hover:bg-beute-gold-dark hover:scale-110 transition-all duration-250 z-50 group"
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  )
}

// Utility for className merging
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
