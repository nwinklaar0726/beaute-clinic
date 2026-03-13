import { Award, GraduationCap, Users, Star, Quote, CheckCircle2, Sparkles } from 'lucide-react'
import { SectionHeader, SectionContainer, SectionDivider } from '@/components/ui/section-header'
import { CardLuxury } from '@/components/ui/card-luxury'

/**
 * BEAUTÉ ABOUT SECTION
 * 
 * Sección "Nosotros" diseñada según el Brandbook:
 * - Foto de la Dra. Meyryn con marco decorativo
 * - Biografía y filosofía
 * - Credenciales y certificaciones
 * - Testimonios de pacientes
 */

const credentials = [
  {
    icon: GraduationCap,
    title: 'Formación Académica',
    items: [
      'Doctora en Medicina - Universidad Nacional',
      'Especialista en Medicina Estética',
      'Diplomado en Nutrición Oncológica',
      'Certificación Internacional en Aparatología'
    ]
  },
  {
    icon: Award,
    title: 'Certificaciones',
    items: [
      'Miembro de la Sociedad de Medicina Estética',
      'Certificación en Ácido Hialurónico Avanzado',
      'Especialista en Terapia Intravenosa',
      'Formación continua internacional'
    ]
  },
  {
    icon: Users,
    title: 'Experiencia',
    items: [
      '+10 años de práctica médica',
      '+5,000 pacientes satisfechos',
      'Especialista en pacientes oncológicos',
      'Enfoque integral del bienestar'
    ]
  }
]

const testimonials = [
  {
    name: 'María González',
    text: 'La Dra. Carrillo transformó completamente mi piel. Su enfoque personalizado y profesional me dio resultados increíbles.',
    rating: 5,
    service: 'Medicina Estética'
  },
  {
    name: 'Carmen Rodríguez',
    text: 'Después de mi tratamiento de cáncer, la nutrición oncológica de Beauté fue fundamental en mi recuperación.',
    rating: 5,
    service: 'Nutrición Oncológica'
  },
  {
    name: 'Ana Martínez',
    text: 'El ambiente de la clínica es tan relajante y la atención es excepcional. Recomiendo Beauté al 100%.',
    rating: 5,
    service: 'Aparatología'
  }
]

export function About() {
  return (
    <SectionContainer 
      id="nosotros" 
      className="bg-beute-cream"
    >
      {/* Section Header */}
      <div className="flex justify-center">
        <SectionHeader
          label="Conócenos"
          labelIcon={<Star className="w-4 h-4" />}
          title="Dra."
          titleHighlight="Meyryn Carrillo"
          subtitle="Fundadora de Beauté, apasionada por realzar la belleza natural y mejorar la calidad de vida de sus pacientes a través de un enfoque médico integral."
          align="center"
        />
      </div>

      {/* Main Content - Doctor Profile */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        {/* Image Column */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-elegant">
            <img 
              src="/images/dra-meyryn.jpg" 
              alt="Dra. Meyryn Carrillo" 
              className="w-full aspect-[3/4] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-beute-earth-deep/30 via-transparent to-transparent" />
          </div>
          
          {/* Decorative Frame */}
          <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-beute-gold/30 rounded-3xl -z-10 hidden lg:block" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-beute-gold/10 rounded-full -z-10 hidden lg:block" />
          
          {/* Experience Badge */}
          <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-beute-gold flex items-center justify-center shadow-gold">
                <span className="font-dream text-2xl text-white">+10</span>
              </div>
              <div>
                <p className="font-medium text-beute-earth-dark">Años de</p>
                <p className="text-sm text-beute-taupe">Experiencia Médica</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:pl-8">
          <h3 className="font-dream text-3xl text-beute-earth-deep mb-4">
            Medicina Estética con Propósito
          </h3>
          
          <p className="text-beute-earth-medium font-light leading-relaxed mb-6">
            Mi filosofía se basa en el equilibrio entre la ciencia médica y el arte de la estética. 
            Cada paciente es único, y por eso diseño tratamientos personalizados que respetan 
            la individualidad y buscan resultados naturales y armoniosos.
          </p>
          
          <p className="text-beute-earth-medium font-light leading-relaxed mb-8">
            Como especialista en nutrición oncológica, entiendo profundamente la importancia del 
            bienestar integral. En Beauté, no solo tratamos el exterior, sino que nutrimos el 
            cuerpo desde adentro para lograr una belleza auténtica y duradera.
          </p>

          {/* Philosophy Points */}
          <div className="space-y-4 mb-8">
            {[
              'Resultados naturales y armoniosos',
              'Atención personalizada y empática',
              'Técnicas basadas en evidencia científica',
              'Enfoque integral de bienestar'
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-beute-gold/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-beute-gold" />
                </div>
                <span className="text-beute-earth-dark">{point}</span>
              </div>
            ))}
          </div>

          {/* Signature */}
          <div className="border-t border-beute-taupe-light pt-6">
            <p className="font-bestand text-2xl text-beute-gold mb-1">Dra. Meyryn Carrillo</p>
            <p className="text-sm text-beute-taupe">Fundadora & Directora Médica - Beauté</p>
          </div>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-24">
        {credentials.map((cred, index) => (
          <CardLuxury 
            key={cred.title} 
            variant="glass"
            padding="lg"
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-14 h-14 rounded-2xl bg-beute-gold/10 flex items-center justify-center mb-5">
              <cred.icon className="w-7 h-7 text-beute-gold" />
            </div>
            <h4 className="font-dream text-xl text-beute-earth-deep mb-4">{cred.title}</h4>
            <ul className="space-y-3">
              {cred.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-beute-earth-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-beute-gold mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardLuxury>
        ))}
      </div>

      {/* Section Divider */}
      <SectionDivider variant="dots" />

      {/* Testimonials Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-beute-rose/10 border border-beute-rose/30 rounded-full px-4 py-2 mb-6">
          <Sparkles className="w-4 h-4 text-beute-rose" />
          <span className="text-xs font-lato font-semibold uppercase tracking-wider text-beute-rose">
            Testimonios
          </span>
        </div>
        <h3 className="font-dream text-3xl lg:text-4xl text-beute-earth-dark">
          Lo que dicen nuestros <span className="text-gradient-gold">pacientes</span>
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <CardLuxury 
            key={testimonial.name} 
            variant="default"
            padding="lg"
            className="relative animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Quote Icon */}
            <Quote className="absolute top-6 right-6 w-10 h-10 text-beute-gold/10" />
            
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-beute-gold text-beute-gold" />
              ))}
            </div>
            
            {/* Text */}
            <p className="text-beute-earth-medium font-light leading-relaxed mb-4">
              "{testimonial.text}"
            </p>
            
            {/* Service badge */}
            <span className="inline-block text-xs text-beute-gold bg-beute-gold/10 px-3 py-1 rounded-full mb-4">
              {testimonial.service}
            </span>
            
            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-beute-taupe-light/30">
              <div className="w-10 h-10 rounded-full bg-beute-gold/10 flex items-center justify-center">
                <span className="font-dream text-sm text-beute-gold">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-beute-earth-dark text-sm">{testimonial.name}</p>
                <p className="text-xs text-beute-taupe">Paciente verificado</p>
              </div>
            </div>
          </CardLuxury>
        ))}
      </div>
    </SectionContainer>
  )
}
