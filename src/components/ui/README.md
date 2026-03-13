# Beauté Design System - Componentes UI

## Componentes Luxury Personalizados

Este directorio contiene los componentes UI diseñados específicamente según el Brandbook de Beauté.

### Componentes Principales

#### 1. ButtonLuxury
Botones premium con gradientes dorados y micro-interacciones.

```tsx
import { ButtonLuxury } from '@/components/ui/button-luxury'

// Variantes
<ButtonLuxury variant="primary">Primary Gold</ButtonLuxury>
<ButtonLuxury variant="secondary">Outline Dark</ButtonLuxury>
<ButtonLuxury variant="outline">Outline Gold</ButtonLuxury>
<ButtonLuxury variant="ghost">Ghost</ButtonLuxury>
<ButtonLuxury variant="soft">Soft Background</ButtonLuxury>
<ButtonLuxury variant="white">White</ButtonLuxury>
<ButtonLuxury variant="rose">Rose Accent</ButtonLuxury>
<ButtonLuxury variant="olive">Olive Accent</ButtonLuxury>

// Estados
<ButtonLuxury isLoading>Loading...</ButtonLuxury>
<ButtonLuxury disabled>Disabled</ButtonLuxury>

// Con íconos
<ButtonLuxury leftIcon={<Icon />}>With Left Icon</ButtonLuxury>
<ButtonLuxury rightIcon={<Icon />}>With Right Icon</ButtonLuxury>
```

#### 2. CardLuxury
Tarjetas elegantes con sombras suaves y efectos hover.

```tsx
import { CardLuxury, CardHeader, CardTitle, CardContent, CardFooter, CardBadge, CardImageHover } from '@/components/ui/card-luxury'

// Variantes
<CardLuxury variant="default">Default</CardLuxury>
<CardLuxury variant="glass">Glassmorphism</CardLuxury>
<CardLuxury variant="bordered">Bordered</CardLuxury>
<CardLuxury variant="elevated">Elevated Shadow</CardLuxury>
<CardLuxury variant="dark">Dark Theme</CardLuxury>
<CardLuxury variant="gold">Gold Accent</CardLuxury>

// Padding
<CardLuxury padding="none">No padding</CardLuxury>
<CardLuxury padding="sm">Small</CardLuxury>
<CardLuxury padding="default">Default</CardLuxury>
<CardLuxury padding="lg">Large</CardLuxury>
<CardLuxury padding="xl">Extra Large</CardLuxury>
```

#### 3. SectionHeader
Headers de sección estandarizados con badge, título y subtítulo.

```tsx
import { SectionHeader, SectionDivider, SectionContainer } from '@/components/ui/section-header'

<SectionHeader
  label="Nuestros Servicios"
  labelIcon={<Sparkles />}
  title="Servicios Médicos de"
  titleHighlight="Excelencia"
  subtitle="Descripción de la sección..."
  align="center" // "left" | "center" | "right"
/>

<SectionDivider variant="gradient" /> // "gradient" | "simple" | "dots"

<SectionContainer 
  id="section-id"
  withPattern // Patrón botánico de fondo
  patternVariant="leaf" // "leaf" | "dot"
>
  Content
</SectionContainer>
```

#### 4. ServiceCard
Tarjetas de servicio específicas con imagen, badges y CTAs.

```tsx
import { ServiceCard } from '@/components/ui/service-card'

<ServiceCard
  id="service-id"
  title="Título del Servicio"
  subtitle="Subtítulo"
  description="Descripción..."
  image="/images/service.jpg"
  category="Categoría"
  duration="45 min"
  price="₡100,000"
  priceFrom={true}
  features={['Feature 1', 'Feature 2']}
  popular={true}
  isNew={false}
  variant="default" // "default" | "horizontal" | "compact"
  onBook={() => {}}
/>
```

#### 5. BookingCalendar
Calendario de citas con selección de fecha y hora.

```tsx
import { BookingCalendar } from '@/components/ui/booking-calendar'

<BookingCalendar
  selectedDate={date}
  selectedTime={time}
  onSelectDate={(date) => {}}
  onSelectTime={(time) => {}}
  availableDates={[date1, date2]}
  timeSlots={[{ time: '09:00', available: true }]}
  minDate={new Date()}
  maxDate={futureDate}
/>
```

## Colores del Brandbook

### Primary Colors
- `--beute-cream`: #FAEFE6 - Fondo principal
- `--beute-cream-light`: #FDF8F3
- `--beute-cream-dark`: #F5E6D8
- `--beute-nude`: #F6F2EF - Cards y secciones

### Earth Colors
- `--beute-earth-deep`: #51350C - Textos principales
- `--beute-earth-medium`: #925F42 - Subtítulos
- `--beute-earth-light`: #B8936F
- `--beute-earth-muted`: #D4C4B0

### Gold Accent
- `--beute-gold`: #AC802A - CTAs y acentos
- `--beute-gold-light`: #C9A961 - Hover states
- `--beute-gold-pale`: #E8D5A8
- `--beute-gold-dark`: #8A6B20

### Rose Accent
- `--beute-rose`: #A97574
- `--beute-rose-light`: #D2A4A1
- `--beute-rose-pale`: #F5D6D3

### Functional
- `--beute-success`: #7A9E7E
- `--beute-warning`: #C9A961
- `--beute-error`: #A65D57
- `--beute-info`: #6B8E9B

## Tipografía

### Display Font
- **Dream Orphans**: Títulos, headlines, elementos de prestigio

### Body Font
- **Lato** (300, 400, 700): Cuerpo de texto, UI elements

### Accent Font
- **Bestand**: Firma, elementos decorativos
- **Apollo**: Elementos especiales

## Espaciado

El sistema usa espaciado generoso para transmitir calma y exclusividad:

- Secciones: `py-20 lg:py-28 xl:py-32`
- Cards padding: `p-6 lg:p-8`
- Gap entre elementos: `gap-6 lg:gap-8`

## Sombras

- `shadow-soft`: Sombra suave por defecto
- `shadow-gold`: Sombra dorada para CTAs
- `shadow-elegant`: Sombra elevada para cards

## Animaciones

- `animate-fade-in-up`: Entrada suave desde abajo
- `animate-float`: Flotación continua
- `animate-shimmer`: Efecto shimmer dorado

## Uso en Tailwind

```tsx
// Colores
<div className="bg-beute-cream text-beute-earth-deep">
<div className="bg-beute-gold text-white">
<div className="text-beute-gold hover:text-beute-gold-light">

// Tipografía
<h1 className="font-dream text-display-1">
<p className="font-lato text-body-lg font-light">

// Sombras
<div className="shadow-soft hover:shadow-elegant">
<button className="shadow-gold hover:shadow-gold-lg">

// Gradientes
<div className="bg-gold-gradient">
<div className="text-gradient-gold">
```
